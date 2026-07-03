const { getDb, requireAdmin, serverTimestamp } = require("./_firebaseAdmin");

const guardianStates = [
  {
    id: "adan-dormant",
    title: "Adan Éson — Presença Oculta",
    state: "DORMANT",
    order: 1,
    spoilerLevel: "PUBLICO",
    requiredAccess: "PUBLICO",
    description: "O Guardião existe como esfera de luz, ainda sem revelar sua identidade completa.",
    unlockHint: "Abra o app e inicie a leitura.",
    imageUrl: null
  },
  {
    id: "adan-primeira-lua",
    title: "Adan Éson — Primeira Lua",
    state: "PRIMEIRA_LUA",
    order: 2,
    spoilerLevel: "LIVRO_1",
    requiredAccess: "LIVRO_1",
    description: "A identidade do Guardião reconhece o leitor que ativou um código real do Livro I.",
    unlockHint: "Ative um código real do livro.",
    imageUrl: null
  },
  {
    id: "adan-singular",
    title: "Adan Éson — O Singular",
    state: "SINGULAR",
    order: 3,
    spoilerLevel: "LIVRO_1",
    requiredAccess: "LIVRO_1",
    unlockPhrase: "ADAN IS ONE",
    acceptedPhrases: ["ADAN IS ONE", "ADAN E ONE", "ADAN É ONE"],
    description: "Aspecto da unidade, origem e consciência primeira. O nome responde como frase-chave.",
    unlockHint: "Descubra e registre o Log do Nome: Adan is one.",
    imageUrl: null
  },
  {
    id: "adan-ausente",
    title: "Adan Éson — O Ausente",
    state: "AUSENTE",
    order: 4,
    spoilerLevel: "LIVRO_1",
    requiredAccess: "LIVRO_1",
    unlockPhrase: "NO SE NADA",
    acceptedPhrases: ["NO SE NADA", "NO SÉ NADA", "NO ES NADA", "NO ÉS NADA"],
    description: "Aspecto do vazio, da inversão e do autor que sabe que não sabe diante do cosmos.",
    unlockHint: "Leia o nome ao contrário e registre o segundo Log.",
    imageUrl: null
  },
  {
    id: "adan-paradoxo",
    title: "Adan Éson — O Paradoxo",
    state: "PARADOXO",
    order: 5,
    spoilerLevel: "TRILOGIA_1",
    requiredAccess: "LIVRO_1",
    requiredStates: ["adan-singular", "adan-ausente"],
    description: "A luz e o vazio coexistindo no mesmo nome. A máscara narrativa do Guardião revela o Entrelume.",
    unlockHint: "Desbloqueie os estados Singular e Ausente.",
    imageUrl: null
  }
];

const badges = [
  { id: "insignia-01-primeira-pagina", order: 1, title: "Primeira Página", description: "Abriu o primeiro portal de leitura.", unlockType: "READ_START", spoilerLevel: "PUBLICO", imageUrl: null },
  { id: "insignia-02-testemunha-do-despertar", order: 2, title: "Testemunha do Despertar", description: "Concluiu os três capítulos gratuitos.", unlockType: "READ_FREE_CHAPTERS", spoilerLevel: "CAPITULO_3", imageUrl: null },
  { id: "insignia-03-portador-do-reflexo", order: 3, title: "Portador do Reflexo", description: "Ativou um código real e recebeu o Reflexo de Capa.", unlockType: "ACTIVATION", spoilerLevel: "LIVRO_1", imageUrl: null },
  { id: "insignia-04-primeira-lua", order: 4, title: "Leitor da Primeira Lua", description: "Liberou a primeira camada do Lore Entrelume.", unlockType: "LORE_UNLOCK", spoilerLevel: "LIVRO_1", imageUrl: null },
  { id: "insignia-05-fragmento-rna", order: 5, title: "Guardião do Fragmento RNA", description: "Despertou o primeiro eco de memória RNA.", unlockType: "VISUAL_ECHO", spoilerLevel: "LIVRO_1", imageUrl: null },
  { id: "insignia-06-agua-como-sangue", order: 6, title: "Sangue da Terra", description: "Reconheceu a água como linguagem sagrada da Terra viva.", unlockType: "LORE_FRAGMENT", spoilerLevel: "LIVRO_1", imageUrl: null },
  { id: "insignia-07-nave-key", order: 7, title: "Sinal da Nave Key", description: "Encontrou o primeiro sinal da nave presa ao tempo profundo.", unlockType: "LORE_FRAGMENT", spoilerLevel: "TRILOGIA_1", imageUrl: null },
  { id: "insignia-08-log-do-nome", order: 8, title: "Descobridor do Nome", description: "Registrou uma frase-chave de Adan Éson.", unlockType: "GUARDIAN_LOG", spoilerLevel: "LIVRO_1", imageUrl: null },
  { id: "insignia-09-paradoxo-entrelume", order: 9, title: "Portador do Paradoxo", description: "Desbloqueou os estados Singular e Ausente do Guardião.", unlockType: "GUARDIAN_PARADOX", spoilerLevel: "TRILOGIA_1", imageUrl: null }
];

const visualEchoes = [
  {
    id: "eco-primeiro-diapasao",
    title: "O Primeiro Diapasão",
    chapterId: "livro-1-capitulo-1",
    triggerId: "VISAO-001-PRIMEIRO-DIAPASAO",
    guardianPrompt: "Um eco foi despertado. Deseja ver o que aconteceu?",
    spoilerLevel: "CAPITULO_1",
    requiredAccess: "PUBLICO",
    order: 1,
    images: [],
    captions: [
      "A civilização original escutava a Terra como corpo vivo.",
      "Um objeto sem canto atravessou o céu.",
      "O primeiro ferimento no sangue do mundo foi percebido como ciência e rito."
    ]
  }
];

async function setIfMissing(transaction, ref, data) {
  const snap = await transaction.get(ref);
  if (!snap.exists) {
    transaction.set(ref, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    return "created";
  }
  transaction.set(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
  return "updated";
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido." });
  }

  try {
    requireAdmin(req);
    const db = getDb();
    const summary = {
      guardianStates: 0,
      badges: 0,
      visualEchoes: 0,
      configs: 0
    };

    await db.runTransaction(async (transaction) => {
      await setIfMissing(transaction, db.collection("counters").doc("sales"), {
        soldCount: 0,
        launchGoal: 300
      });
      summary.configs += 1;

      await setIfMissing(transaction, db.collection("appConfig").doc("store"), {
        purchaseUrl: ""
      });
      summary.configs += 1;

      await setIfMissing(transaction, db.collection("appConfig").doc("guardian"), {
        currentVersion: "guardian-v1",
        displayName: "PicoClaw Guardião do Lore",
        maskName: "Adan Éson",
        logMechanicName: "O Nome que Responde"
      });
      summary.configs += 1;

      for (const item of guardianStates) {
        await setIfMissing(transaction, db.collection("guardianStates").doc(item.id), item);
        summary.guardianStates += 1;
      }

      for (const item of badges) {
        await setIfMissing(transaction, db.collection("badges").doc(item.id), item);
        summary.badges += 1;
      }

      for (const item of visualEchoes) {
        await setIfMissing(transaction, db.collection("visualEchoes").doc(item.id), item);
        summary.visualEchoes += 1;
      }
    });

    return res.status(200).json({
      ok: true,
      message: "Estrutura do Guardião inicializada no Firebase.",
      summary
    });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ error: error.message || "Falha ao inicializar Guardião." });
  }
};
