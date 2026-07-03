const { admin, getDb, serverTimestamp } = require("./_firebaseAdmin");

function normalizePhrase(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, "")
    .replace(/\s+/g, " ");
}

function resolvePhrase(rawPhrase) {
  const phrase = normalizePhrase(rawPhrase);

  if (["ADAN IS ONE", "ADAN E ONE", "ADAN EH ONE"].includes(phrase)) {
    return {
      logId: "ADAN_IS_ONE",
      guardianState: "adan-singular",
      title: "Adan Éson — O Singular"
    };
  }

  if (["NO SE NADA", "NO ES NADA"].includes(phrase)) {
    return {
      logId: "NO_SE_NADA",
      guardianState: "adan-ausente",
      title: "Adan Éson — O Ausente"
    };
  }

  return null;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido." });
  }

  try {
    const authHeader = req.headers.authorization || "";
    const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!idToken) return res.status(401).json({ error: "Login obrigatório." });

    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;
    const phraseResult = resolvePhrase(req.body && req.body.phrase);

    if (!phraseResult) {
      return res.status(400).json({
        error: "Log não reconhecido. O nome ainda não respondeu a esta frase."
      });
    }

    const db = getDb();
    const userStateRef = db.collection("users").doc(uid).collection("app").doc("state");
    const logRef = db.collection("users").doc(uid).collection("guardianLogs").doc(phraseResult.logId);
    let responsePayload = null;

    await db.runTransaction(async (transaction) => {
      const stateSnap = await transaction.get(userStateRef);
      const data = stateSnap.exists ? stateSnap.data() : {};

      if (!data.activated) {
        const error = new Error("Ative um código real do livro antes de registrar Logs do Nome.");
        error.status = 403;
        throw error;
      }

      const currentStates = Array.isArray(data.guardianStates) ? data.guardianStates : [];
      const nextStates = Array.from(new Set([...currentStates, phraseResult.guardianState]));
      const hasSingular = nextStates.includes("adan-singular");
      const hasAusente = nextStates.includes("adan-ausente");
      const unlockedParadox = hasSingular && hasAusente && !nextStates.includes("adan-paradoxo");

      if (hasSingular && hasAusente) nextStates.push("adan-paradoxo");

      const badges = new Set(Array.isArray(data.badges) ? data.badges : []);
      badges.add("first-page");
      badges.add("cover-reflection");
      badges.add("insignia-08-log-do-nome");
      if (hasSingular && hasAusente) badges.add("insignia-09-paradoxo-entrelume");

      transaction.set(logRef, {
        logId: phraseResult.logId,
        phrase: req.body.phrase,
        normalizedPhrase: normalizePhrase(req.body.phrase),
        guardianState: phraseResult.guardianState,
        title: phraseResult.title,
        createdAt: serverTimestamp()
      }, { merge: true });

      transaction.set(userStateRef, {
        guardianStates: Array.from(new Set(nextStates)),
        currentGuardianState: hasSingular && hasAusente ? "adan-paradoxo" : phraseResult.guardianState,
        badges: Array.from(badges),
        updatedAt: serverTimestamp()
      }, { merge: true });

      responsePayload = {
        ok: true,
        unlockedState: phraseResult.guardianState,
        title: phraseResult.title,
        currentGuardianState: hasSingular && hasAusente ? "adan-paradoxo" : phraseResult.guardianState,
        unlockedParadox,
        badges: Array.from(badges)
      };
    });

    return res.status(200).json(responsePayload);
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ error: error.message || "Falha ao registrar Log do Nome." });
  }
};
