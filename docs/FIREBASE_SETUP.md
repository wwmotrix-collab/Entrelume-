# Firebase Setup — Entrelume real

## Importante

As regras em JSON com `.read` e `.write` são do **Realtime Database**.

Este app usa **Cloud Firestore**, então as regras corretas são as do arquivo `firestore.rules` deste repositório.

## Serviços usados

- Firebase App
- Firebase Authentication com login anônimo
- Cloud Firestore
- Firebase Admin no backend Vercel (`api/redeem.js`)

## Ativar no Firebase

1. Abra o projeto `entrelume-d69e4`.
2. Vá em **Authentication**.
3. Em **Sign-in method**, habilite **Anonymous**.
4. Vá em **Firestore Database**.
5. Crie o banco.
6. Publique as regras do arquivo `firestore.rules`.

## Variáveis de ambiente na Vercel

O endpoint `/api/redeem` precisa de Firebase Admin.

Opção simples:

```text
FIREBASE_SERVICE_ACCOUNT_JSON={...json completo da service account...}
```

Opção separada:

```text
FIREBASE_PROJECT_ID=entrelume-d69e4
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
```

Após salvar as variáveis, faça redeploy na Vercel.

## Coleções reais

### `appConfig/store`

Configuração pública da loja:

```json
{
  "purchaseUrl": "https://seu-link-real-de-pagamento.com"
}
```

### `counters/sales`

Contador público da loja, atualizado somente pelo backend:

```json
{
  "soldCount": 0,
  "launchGoal": 300,
  "updatedAt": "serverTimestamp"
}
```

### `activationCodes/{CODIGO}`

Código real gerado após compra ou importado pelo autor/admin:

```json
{
  "status": "available",
  "bookId": "bestseller-epico-livro-1",
  "edition": "Primeira Lua",
  "language": "pt-BR",
  "serialNumber": "000001",
  "createdAt": "serverTimestamp"
}
```

Quando resgatado, vira:

```json
{
  "status": "redeemed",
  "redeemedBy": "uid-do-leitor",
  "redeemedAt": "serverTimestamp",
  "reflectionId": "cover-reflection-000001"
}
```

### `purchases/{uid_codigo}`

Criado pelo backend no resgate:

```json
{
  "uid": "uid-do-leitor",
  "activationCode": "CODIGO",
  "bookId": "bestseller-epico-livro-1",
  "edition": "Primeira Lua",
  "language": "pt-BR",
  "reflectionId": "cover-reflection-000001",
  "createdAt": "serverTimestamp"
}
```

### `users/{uid}/app/state`

Estado do leitor:

```json
{
  "activated": true,
  "readCompleted": true,
  "badges": ["first-page", "witness", "cover-reflection"],
  "reflection": {
    "id": "cover-reflection-000001",
    "bookId": "bestseller-epico-livro-1",
    "edition": "Primeira Lua",
    "language": "pt-BR",
    "serialNumber": "000001",
    "mintStatus": "not_minted",
    "walletAddress": null,
    "tokenId": null,
    "contractAddress": null,
    "metadataUri": null
  }
}
```

## Gerar códigos reais

Com as variáveis de Firebase Admin configuradas localmente:

```bash
npm install
node scripts/createActivationCode.js --code=ENT-PRIMEIRA-LUA-0001 --serial=1
```

Ou gerar lote automático:

```bash
node scripts/createActivationCode.js --count=10 --serial=1
```

## Fluxo real atual

```text
Leitor compra pelo link real -> recebe/cadastra código -> digita no app -> /api/redeem valida com Firebase Admin -> marca código como redeemed -> cria purchase -> cria Reflexo de Capa -> incrementa contador real -> libera Lore
```

## Próxima evolução

Trocar o cadastramento manual de códigos por webhook de pagamento:

- Mercado Pago
- Stripe
- Hotmart
- Kiwify

O webhook deve gerar o `activationCode` automaticamente após pagamento aprovado.
