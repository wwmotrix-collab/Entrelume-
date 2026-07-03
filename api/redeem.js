const admin = require("firebase-admin");

function getServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  }

  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    };
  }

  return null;
}

function initAdmin() {
  if (admin.apps.length) return admin.app();

  const serviceAccount = getServiceAccount();
  if (!serviceAccount) {
    throw new Error(
      "Firebase Admin não configurado. Defina FIREBASE_SERVICE_ACCOUNT_JSON ou FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY na Vercel."
    );
  }

  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

function normalizeCode(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-_]/g, "");
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido." });
  }

  try {
    initAdmin();
    const authHeader = req.headers.authorization || "";
    const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!idToken) {
      return res.status(401).json({ error: "Login obrigatório para ativar código." });
    }

    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;
    const code = normalizeCode(req.body && req.body.code);

    if (!code) {
      return res.status(400).json({ error: "Código de ativação obrigatório." });
    }

    const db = admin.firestore();
    const now = admin.firestore.FieldValue.serverTimestamp();
    const activationRef = db.collection("activationCodes").doc(code);
    const counterRef = db.collection("counters").doc("sales");
    const userStateRef = db.collection("users").doc(uid).collection("app").doc("state");
    const purchaseRef = db.collection("purchases").doc(`${uid}_${code}`);

    let result;

    await db.runTransaction(async (transaction) => {
      const activationSnap = await transaction.get(activationRef);
      const counterSnap = await transaction.get(counterRef);

      if (!activationSnap.exists) {
        const error = new Error("Código não encontrado.");
        error.status = 404;
        throw error;
      }

      const activation = activationSnap.data();
      if (activation.status !== "available") {
        const error = new Error("Código já utilizado ou indisponível.");
        error.status = 409;
        throw error;
      }

      const currentSold = counterSnap.exists ? Number(counterSnap.data().soldCount || 0) : 0;
      const launchGoal = counterSnap.exists ? Number(counterSnap.data().launchGoal || 300) : 300;
      const serialNumber = String(activation.serialNumber || currentSold + 1).padStart(6, "0");

      const reflection = {
        id: `cover-reflection-${serialNumber}`,
        bookId: activation.bookId || "bestseller-epico-livro-1",
        edition: activation.edition || "Primeira Lua",
        language: activation.language || "pt-BR",
        serialNumber,
        coverImageUrl: activation.coverImageUrl || null,
        mintStatus: "not_minted",
        walletAddress: null,
        tokenId: null,
        contractAddress: null,
        metadataUri: null,
        activationCode: code,
        createdAt: new Date().toISOString()
      };

      transaction.set(counterRef, {
        soldCount: currentSold + 1,
        launchGoal,
        updatedAt: now
      }, { merge: true });

      transaction.update(activationRef, {
        status: "redeemed",
        redeemedBy: uid,
        redeemedAt: now,
        reflectionId: reflection.id
      });

      transaction.set(purchaseRef, {
        uid,
        activationCode: code,
        bookId: reflection.bookId,
        edition: reflection.edition,
        language: reflection.language,
        reflectionId: reflection.id,
        createdAt: now
      });

      transaction.set(userStateRef, {
        activated: true,
        badges: admin.firestore.FieldValue.arrayUnion("first-page", "cover-reflection"),
        reflection,
        updatedAt: now
      }, { merge: true });

      result = {
        reflection,
        soldCount: currentSold + 1,
        launchGoal
      };
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({
      error: error.message || "Falha ao ativar código."
    });
  }
};
