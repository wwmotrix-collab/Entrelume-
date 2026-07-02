# Entrelume — Especificação do Produto

## 1. Conceito

Entrelume é um app de leitura colecionável para a saga Bestseller Épico.

O leitor começa por capítulos gratuitos, compra o livro, desbloqueia lore por QR code único, recebe insígnias de leitura e participa de eventos narrativos.

A camada NFT é futura. O MVP deve operar com itens digitais internos chamados **Reflexos de Capa**.

## 2. Navegação principal

### Leitura

- 3 capítulos gratuitos disponíveis para qualquer usuário.
- Gancho ao final do terceiro capítulo para compra do livro completo.
- Leitor com progresso por página/capítulo.
- Futuramente: comando por voz para subir/descer página.

### Lore

- Bloqueado para visitantes.
- Liberado por compra, QR code ou código de ativação.
- Conteúdos: fragmentos, mapas, logs, portais narrativos, insígnias, linha do tempo e eventos.
- Deve respeitar nível de leitura do usuário para evitar spoilers.

### Loja

- Card do livro atual.
- Botão de compra.
- Contador de vendidos.
- Barra para próximo lançamento/meta coletiva.
- Futuramente: edições especiais, capas, itens físicos e NFTs.

## 3. Fluxos principais

### Fluxo gratuito

1. Usuário abre app.
2. Lê capítulos gratuitos.
3. Ao final, vê chamada para comprar o livro completo.
4. Pode criar conta para salvar progresso.

### Fluxo de compra

1. Usuário compra livro.
2. Sistema cria registro de compra.
3. Sistema gera QR/código único.
4. Usuário ativa o código.
5. Lore do livro é liberado.
6. Sistema gera Reflexo de Capa.
7. Contador de vendidos é atualizado.

### Fluxo de leitura colecionável

1. Usuário lê capítulo.
2. Progresso é salvo.
3. Ao concluir marcos, recebe insígnias.
4. Certos marcos liberam fragmentos de lore.
5. Eventos podem liberar conteúdo temporário.

## 4. Reflexo de Capa

Item digital interno gerado a cada venda/ativação.

Campos sugeridos:

- id
- userId
- bookId
- edition
- language
- serialNumber
- coverImageUrl
- qrActivationId
- metadata
- mintStatus
- walletAddress
- tokenId
- contractAddress
- metadataUri
- createdAt

Status inicial: `not_minted`.

## 5. Insígnias

Insígnias representam progressos e conquistas de leitura.

Exemplos:

- Primeira Página
- Testemunha do Despertar
- Portador do Primeiro Reflexo
- Leitor da Primeira Lua
- Guardião do Fragmento RNA

## 6. Guardião do Lore

Agente interno com duas camadas:

- Leitor: responde sem spoiler e dentro do tom do universo.
- Admin: ajuda autor/desenvolvedor a manter continuidade.

Deve consultar:

- nível de leitura do usuário;
- livros comprados;
- fragmentos desbloqueados;
- camada canon/quase-canon/laboratório.

## 7. MVP recomendado

Primeira versão deve conter:

- frontend PWA;
- dados mockados ou JSON local;
- três capítulos gratuitos;
- loja simulada;
- ativação simulada de QR/código;
- criação simulada de Reflexo de Capa;
- aba Lore com bloqueio/desbloqueio;
- área de insígnias;
- estrutura pronta para backend.

## 8. Evoluções futuras

- Firebase/Supabase real.
- Mercado Pago/Stripe/Hotmart.
- Comandos de voz.
- Notificações push.
- Painel admin.
- Integração com carteira cripto.
- Mint dos Reflexos como NFTs.
- NFTs dinâmicos e token gating.
