# Runbook — Deploy do app único (apps/lps) na Vercel

App consolidado: **`apps/lps`** serve os 4 LPs (medicina, graduação, pós, técnico) roteados por hostname. Este runbook faz o cutover **sem derrubar a medicina** (que hoje está no ar pelo projeto `florence-medicina`).

## Domínios → LP
| Domínio | LP |
|---|---|
| medicina.florence.edu.br | medicina |
| graduacao.florence.edu.br | graduação |
| pos.florence.edu.br | pós |
| tecnico.florence.edu.br | técnico (substitui a página do Instituto) |

## Variáveis de ambiente do projeto (Production + Preview)
Só estas — slug, display name e GTM são resolvidos por hostname no código (registry), não por env:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `CRON_SECRET` (usado pelo cron keep-alive `/api/cron/keep-alive`)

## Banco
Rodar uma vez (se ainda não rodou): `supabase/011_add_leads_metadata.sql` (coluna `metadata`; o form das umbrella grava `metadata.curso_interesse`).

---

## Sequência de cutover (zero downtime na medicina)

1. **Push da branch** `consolidate-lps` para o GitHub (não toca a `main`).
2. **Criar o projeto Vercel** (conta da Florence) → Add New → Project → importar `luan-flipe/florence`:
   - **Root Directory = `apps/lps`**
   - **Production Branch = `consolidate-lps`** (temporário, pra validar antes de mexer na main)
   - Framework: Next.js. Confirmar **"Include files outside the root directory in the Build Step"** ligado (monorepo).
   - Setar as env vars acima.
3. **Deploy** e **validar** na URL `.vercel.app` do projeto, testando cada LP com o override de query:
   - `…vercel.app/?lp=medicina`
   - `…vercel.app/?lp=graduacao`
   - `…vercel.app/?lp=pos-graduacao`
   - `…vercel.app/?lp=tecnico`
   - Enviar um lead de teste em um deles e conferir no Supabase (`lp_slug` correto + `metadata.curso_interesse` nas umbrella).
4. **Anexar os domínios novos** (Settings → Domains): `graduacao.florence.edu.br`, `pos.florence.edu.br`, `tecnico.florence.edu.br`. Eles entram no ar servidos pelo app único. (Confirmar que o host resolve o LP certo, agora sem `?lp=`.)
5. **Mover a medicina** quando validado: adicionar `medicina.florence.edu.br` a este projeto. A Vercel vai pedir pra remover o domínio do projeto antigo (`florence-medicina`) — confirmar. A partir daí a medicina é servida pelo app único.
6. **Finalizar:**
   - Merge `consolidate-lps` → `main`.
   - No projeto unificado: Settings → Git → **Production Branch = `main`**.
   - Pausar/deletar o projeto antigo `florence-medicina`.

## Rollback
- Antes do passo 5, a medicina continua 100% no projeto antigo — rollback é só não anexar o domínio dela.
- Depois do passo 5, rollback da medicina = re-anexar `medicina.florence.edu.br` ao `florence-medicina` (que ainda existe até o passo 6).

## Notas
- Autor dos commits = `ascom@florence.edu.br` (= conta Vercel da Florence) → deploys não travam.
- GTM da medicina (`GTM-MMFZBTKD`) está no registry; as outras LPs ficam sem GTM até definir container próprio (é só adicionar `gtmId` na entry do registry).
- Teste local: `npm run dev:lps` → `localhost:3000/?lp=<slug>`.
