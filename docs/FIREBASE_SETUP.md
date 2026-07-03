# Firebase Setup — Entrelume MVP

## Configuração já conectada no `index.html`

O MVP usa Firebase via CDN no próprio `index.html`.

Serviços usados agora:

- Firebase App
- Firebase Authentication com login anônimo
- Cloud Firestore

## Ativar no console Firebase

1. Abra o projeto `entrelume-d69e4`.
2. Vá em **Authentication**.
3. Clique em **Get started**.
4. Em **Sign-in method**, habilite **Anonymous**.
5. Vá em **Firestore Database**.
6. Crie o banco em modo produção ou teste.
7. Publique as regras de `firestore.rules` deste repositório.

## Coleções criadas pelo MVP

### `counters/sales`

Guarda contador público da loja:

```json
{
  "soldCount": 127,
  "launchGoal": 300,
  "updatedAt": "serverTimestamp"
}
```

### `users/{uid}/app/state`

Guarda estado do leitor anônimo:

```json
{
  "activated": true,
  "readCompleted": true,
  "badges": ["first-page", "witness", "cover-reflection"],
  "reflection": {
    "id": "cover-reflection-000128",
    "bookId": "bestseller-epico-livro-1",
    "edition": "Primeira Lua",
    "language": "pt-BR",
    "serialNumber": "000128",
    "mintStatus": "not_minted",
    "walletAddress": null,
    "tokenId": null,
    "contractAddress": null,
    "metadataUri": null
  }
}
```

## Observações de segurança

A chave `apiKey` do Firebase Web aparece no frontend por natureza. A proteção real vem das regras do Firestore, Auth, validação no backend e, futuramente, webhooks de pagamento.

As regras atuais são adequadas para MVP, mas o contador de vendas ainda é incrementado pelo cliente autenticado anonimamente. Em produção, esse contador deve ser atualizado por backend ou webhook de pagamento.

## Próximo passo recomendado

Criar backend/API ou Cloud Function para:

- validar pagamento real;
- gerar QR/código único;
- criar compra;
- criar Reflexo de Capa;
- atualizar contador de vendas;
- impedir fraude no contador.
