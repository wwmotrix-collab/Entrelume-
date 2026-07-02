# AGENTS.md — Entrelume / Bestseller Épico

Este arquivo orienta Codex, PicoClaw e demais agentes de desenvolvimento/lore neste repositório.

## Missão

Construir o aplicativo **Entrelume**, leitor colecionável e loja narrativa do universo **Bestseller Épico**.

O app deve unir leitura, desbloqueios de lore, insígnias, loja, eventos, QR codes únicos e futura integração Web3/NFT.

## Produto-alvo

MVP instalável como PWA/app web:

- leitura de capítulos gratuitos;
- compra/liberação de livro completo;
- QR code único por venda/unidade;
- aba **Lore** com desbloqueios, insígnias e portais narrativos;
- aba **Loja** com livros, metas, contador de vendas e próximos lançamentos;
- leitor com progresso e comandos simples por voz;
- notificações de eventos;
- painel admin para cadastrar livros, capítulos, metas, eventos e recompensas;
- geração de **Reflexo de Capa** interno a cada venda, NFT-ready, mas sem exigir carteira no MVP.

## Regra Web3/NFT

Não comece exigindo carteira cripto do leitor comum.

Implementar primeiro:

- conta normal do usuário;
- compra normal;
- QR único;
- Reflexo de Capa interno;
- metadados NFT-ready.

Preparar campos futuros:

- walletAddress;
- chainId;
- contractAddress;
- tokenId;
- metadataUri;
- mintStatus: `not_minted | pending | minted | failed`.

## Guardião do Lore

O app deve prever um agente chamado **Guardião do Lore**.

### Modo Leitor

- Nunca entregar spoiler além do nível de leitura/desbloqueio do usuário.
- Responder como sistema/personagem do universo Entrelume.
- Bloquear conteúdo com linguagem diegética, por exemplo: `Autorização lunar insuficiente para este fragmento.`

### Modo Autor/Admin

- Ajudar a manter continuidade da saga.
- Separar ideias em quatro camadas:
  - `CANON`: confirmado.
  - `QUASE_CANON`: aprovado, mas ainda editável.
  - `LABORATORIO`: ideia em teste.
  - `EVITAR`: termo, rota ou abordagem descartada.

## Regras de lore já fixadas

- A humanidade original é uma civilização avançada tecnologicamente, espiritualmente e socialmente.
- Evitar tratar a humanidade original como primitiva.
- Evitar o termo **tribos** para essa civilização. Usar termos como civilização, conglomerados civilizatórios, casas, linhagens, conselhos, centros, cidades vivas ou agregados.
- O projeto é uma ficção especulativa antirracista, com cuidado para não transformar mecanismos ficcionais em justificativas biológicas reais.
- O RNA alienígena, quando citado, deve ser artificial, instável, militar e ficcional; não é desculpa para racismo real.

## Estilo de desenvolvimento

- Priorizar MVP simples, funcional e expandível.
- Criar código claro, modular e documentado.
- Evitar acoplamento prematuro com blockchain.
- Não expor chaves de IA, pagamento ou banco no frontend.
- Preferir variáveis de ambiente para integrações sensíveis.
- Manter nomes do domínio narrativo: Lore, Loja, Reflexo de Capa, Insígnias, Portais Narrativos, Luas, Conselho, Entrelume.

## Entidades iniciais sugeridas

- User
- Book
- Chapter
- Purchase
- QRActivation
- LoreUnlock
- Badge
- CoverReflection
- Event
- LaunchGoal
- ReadingProgress

## Primeira entrega esperada

Criar um MVP web com:

1. Página inicial com três capítulos gratuitos.
2. Aba Lore bloqueada/desbloqueada.
3. Aba Loja com card do livro, contador de vendas e barra de próximo lançamento.
4. Simulação de compra/ativação por QR.
5. Área de insígnias e Reflexo de Capa.
6. Estrutura pronta para backend real.
