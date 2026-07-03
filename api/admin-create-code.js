const crypto = require("crypto");
const { getDb, requireAdmin, normalizeCode, serverTimestamp } = require("./_firebaseAdmin");

function randomCode() {
  const chunk = () => crypto.randomBytes(3).toString("hex").toUpperCase();
  return `ENT-${chunk()}-${chunk()}`;
}

function padSerial(value) {
  return String(value).padStart(6, "0");
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido." });
  }

  try {
    requireAdmin(req);
    const db = getDb();
    const body = req.body || {};
    const count = Math.max(1, Math.min(100, Number(body.count || 1)));
    const serialStart = Number(body.serialStart || Date.now());
    const explicitCode = body.code ? normalizeCode(body.code) : "";
    const codes = [];

    if (explicitCode && count > 1) {
      return res.status(400).json({ error: "Para código manual, use count = 1." });
    }

    const batch = db.batch();

    for (let i = 0; i < count; i += 1) {
      const code = explicitCode || randomCode();
      const ref = db.collection("activationCodes").doc(code);
      const snap = await ref.get();

      if (snap.exists) {
        return res.status(409).json({ error: `Código já existe: ${code}` });
      }

      const serialNumber = padSerial(serialStart + i);
      batch.set(ref, {
        status: "available",
        bookId: body.bookId || "bestseller-epico-livro-1",
        edition: body.edition || "Primeira Lua",
        language: body.language || "pt-BR",
        serialNumber,
        createdAt: serverTimestamp(),
        createdBy: "admin-bridge"
      });

      codes.push({ code, serialNumber });
    }

    await batch.commit();

    return res.status(200).json({
      ok: true,
      message: "Código(s) de ativação criado(s).",
      codes
    });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ error: error.message || "Falha ao criar código." });
  }
};
