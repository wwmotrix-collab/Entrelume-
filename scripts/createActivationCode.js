const admin = require("firebase-admin");
const crypto = require("crypto");

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
    "Defina FIREBASE_SERVICE_ACCOUNT_JSON ou FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY."
  );
}

function initAdmin() {
  if (admin.apps.length) return;
  admin.initializeApp({ credential: admin.credential.cert(getServiceAccount()) });
}

function normalizeCode(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-_]/g, "");
}

function randomCode() {
  const chunk = () => crypto.randomBytes(3).toString("hex").toUpperCase();
  return `ENT-${chunk()}-${chunk()}`;
}

async function main() {
  initAdmin();
  const db = admin.firestore();

  const args = process.argv.slice(2);
  const codeArg = args.find((arg) => arg.startsWith("--code="));
  const serialArg = args.find((arg) => arg.startsWith("--serial="));
  const countArg = args.find((arg) => arg.startsWith("--count="));

  const count = Math.max(1, Number(countArg ? countArg.split("=")[1] : 1));
  const codes = [];

  for (let i = 0; i < count; i += 1) {
    const code = normalizeCode(codeArg ? codeArg.split("=")[1] : randomCode());
    const serialNumber = String(
      serialArg ? Number(serialArg.split("=")[1]) + i : Date.now() + i
    ).padStart(6, "0");

    await db.collection("activationCodes").doc(code).set({
      status: "available",
      bookId: "bestseller-epico-livro-1",
      edition: "Primeira Lua",
      language: "pt-BR",
      serialNumber,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    codes.push(code);
  }

  console.log("Códigos criados:");
  for (const code of codes) console.log(code);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
