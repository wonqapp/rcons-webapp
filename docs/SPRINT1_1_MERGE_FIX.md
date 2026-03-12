# Sprint 1.1 merge fix (если GitHub показывает конфликты)

Если при merge/cherry-pick конфликтуют только эти два файла:
- `src/app/[locale]/services/page.tsx`
- `src/config/services.ts`

то можно безопасно принять изменения Sprint 1.1.

## Вариант A (рекомендуется): локально через terminal

```bash
git fetch origin
git checkout main
git pull --ff-only

git cherry-pick db494a1 || true

git checkout --theirs src/app/[locale]/services/page.tsx src/config/services.ts
git add src/app/[locale]/services/page.tsx src/config/services.ts
git cherry-pick --continue

git push origin main
```

### Почему `--theirs`
Во время `cherry-pick`:
- `ours` = твой текущий `main`
- `theirs` = изменения из коммита `db494a1`

Нам нужно именно содержимое из Sprint 1.1, поэтому выбираем `--theirs`.

## Вариант B: если уже открыт конфликт в GitHub UI

Для обоих конфликтов нажимай:
- **Accept current change**

В твоем кейсе `current change` = ветка с Sprint 1.1 (`codex/...`),
а `incoming` = `main`.

После этого:
1. Mark as resolved
2. Commit merge

## Что должно остаться после резолва

### `src/app/[locale]/services/page.tsx`
В metadata должно быть:

```ts
description: t("pages.services.desc"),
```

### `src/config/services.ts`
Должны присутствовать:
- `ServiceId`
- `ServiceLookup`
- `getServiceById(serviceId)`

