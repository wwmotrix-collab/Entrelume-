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

  throw new Error(
    "Firebase Admin não configurado. Defina FIREBASE_SERVICE_ACCOUNT_JSON ou FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY na Vercel."
  );
}

function initAdmin() {
  if (admin.apps.length) return admin.app();

  return admin.initializeApp({
    credential: admin.credential.cert(getServiceAccount())
  });
}

function getDb() {
  initAdmin();
  return admin.firestore();
}

function getAdminToken(req) {
  const headerToken = req.headers["x-admin-token"] || req.headers["authorization"];
  const bodyToken = req.body && req.body.token;
  const queryToken = req.query && req.query.token;
  const rawToken = headerToken || bodyToken || queryToken || "";

  return String(rawToken).replace(/^Bearer\s+/i, "").trim();
}

function requireAdmin(req) {
  const expected = process.env.ENTRELUME_ADMIN_TOKEN;
  if (!expected) {
    const error = new Error("ENTRELUME_ADMIN_TOKEN não configurado na Vercel.");
    error.status = 500;
    throw error;
  }

  const received = getAdminToken(req);
  if (!received || received !== expected) {
    const error = new Error("Token admin inválido.");
    error.status = 401;
    throw error;
  }
}

function normalizeCode(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-_]/g, "");
}

function serverTimestamp() {
  return admin.firestore.FieldValue.serverTimestamp();
}

module.exports = {
  admin,
  getDb,
  requireAdmin,
  normalizeCode,
  serverTimestamp
};
