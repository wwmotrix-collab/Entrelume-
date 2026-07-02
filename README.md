# Entrelume

Aplicativo oficial do ecossistema **Bestseller Épico / Entrelume**.

## Visão do produto

O Entrelume é um app de leitura colecionável com duas camadas principais para o leitor:

- **Lore**: área desbloqueável por compra, QR code, progresso de leitura, insígnias, portais narrativos, eventos, fragmentos e interações do universo.
- **Loja**: compra dos livros, pré-vendas, contador de vendidos, barra de meta para próximo lançamento e futuras coleções digitais.

A leitura pode começar com capítulos gratuitos e evoluir para o livro completo, com o app registrando progresso, insígnias e desbloqueios narrativos.

## Princípio de arquitetura

O MVP deve começar sem dependência obrigatória de blockchain. Cada venda pode gerar um **Reflexo de Capa** interno, preparado para virar NFT futuramente, mas sem exigir carteira no primeiro contato do leitor.

Fluxo-base:

```text
Compra do livro -> QR único -> libera Lore -> cria Reflexo de Capa -> registra progresso -> libera insígnias -> alimenta contador da loja -> participa da barra do próximo lançamento
```

Fase futura:

```text
Usuário conecta carteira -> Reflexo de Capa pode ser cunhado/vinculado como NFT -> libera benefícios Web3
```

## Guardião do Lore

O app deve prever um agente interno configurado como **Guardião do Lore**, operando em dois modos:

- **Modo Leitor**: responde sem spoiler além do conteúdo desbloqueado pelo usuário.
- **Modo Autor/Admin**: ajuda a manter continuidade, canon, quase-canon, laboratório e itens proibidos/evitados.

## Status

Repositório inicializado para desenvolvimento assistido por Codex/PicoClaw.
