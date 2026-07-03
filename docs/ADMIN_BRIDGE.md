# Ponte Admin Entrelume

A Ponte Admin permite criar e atualizar estruturas do Firebase pelo próprio app, sem precisar montar coleção por coleção no console.

## Requisito

Na Vercel, configure a variável:

```text
ENTRELUME_ADMIN_TOKEN=uma-senha-forte-sua
```

Depois faça redeploy.

## Acesso

Abra:

```text
/admin.html
```

Cole o valor do `ENTRELUME_ADMIN_TOKEN` no campo de token.

## O que a ponte faz

### Inicializar Guardião

Cria/atualiza:

- `guardianStates/adan-dormant`
- `guardianStates/adan-primeira-lua`
- `guardianStates/adan-singular`
- `guardianStates/adan-ausente`
- `guardianStates/adan-paradoxo`
- 9 documentos em `badges`
- `visualEchoes/eco-primeiro-diapasao`
- `appConfig/guardian`
- `appConfig/store`
- `counters/sales`

### Criar código real

Cria documentos em:

```text
activationCodes/{CODIGO}
```

Com status:

```text
available
```

Depois o leitor digita esse código no app, e `/api/redeem` transforma em `redeemed`, cria compra, cria Reflexo de Capa e libera Lore.

### Atualizar link de compra

Atualiza:

```text
appConfig/store.purchaseUrl
```

## Endpoints criados

- `POST /api/admin-seed`
- `POST /api/admin-create-code`
- `POST /api/admin-purchase-link`
- `POST /api/guardian-log`

## Segurança

Os endpoints admin exigem o header:

```text
x-admin-token: seu-token
```

Não publique esse token. Não coloque em print. Não mande em chat.

## Próximo passo

Conectar o painel flutuante do Guardião ao endpoint `/api/guardian-log` para registrar as frases-chave:

- `ADAN IS ONE`
- `NO SE NADA`
- `NO ES NADA`

Quando o usuário registrar as duas camadas, o app desbloqueia:

```text
Adan Éson — O Paradoxo
```
