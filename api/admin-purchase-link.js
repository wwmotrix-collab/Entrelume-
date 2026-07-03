const { getDb, requireAdmin, serverTimestamp } = require("./_firebaseAdmin");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido." });
  }

  try {
    requireAdmin(req);
    const link = String((req.body && req.body.link) || "").trim();
    if (!link) return res.status(400).json({ error: "Link obrigatório." });

    const db = getDb();
    await db.collection("appConfig").doc("store").set({
      purchaseUrl: link,
      updatedAt: serverTimestamp()
    }, { merge: true });

    return res.status(200).json({ ok: true, message: "Link de compra atualizado." });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ error: error.message || "Falha ao atualizar link." });
  }
};
