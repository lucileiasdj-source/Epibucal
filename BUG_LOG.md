# BUG LOG — Epibucal

Historico completo de bugs identificados, corrigidos e monitorados durante o desenvolvimento do projeto Epibucal (PROFSMOC II).

---

## BUG #001

**Data:** 2026-05-21
**Arquivo:** `supabase/migrations/20260521174844_update_rls_for_anonymous_access.sql`
**Problema:** Exames nao podiam ser salvos pela aplicacao porque o Supabase exigia autenticacao (RLS restritivo para `authenticated`), mas o app funciona sem login.
**Causa raiz:** As politicas RLS iniciais foram criadas exclusivamente para usuarios autenticados (`TO authenticated`). Como o app opera em modo anonimo para facilitar a coleta de campo, todas as operacoes de INSERT/SELECT/UPDATE eram bloqueadas pelo banco.
**Solucao implementada:** Removidas todas as politicas de acesso autenticado e criadas novas politicas publicas permitindo INSERT, SELECT e UPDATE para usuarios anonimos. Politicas de DELETE foram intencionalmente omitidas para proteger a integridade dos dados.
**Impacto:** Formulario de coleta passou a funcionar corretamente sem necessidade de login.
**Status:** Resolvido.

---

## BUG #002

**Data:** 2026-05-22
**Arquivo:** `supabase/migrations/20260522134943_reorganize_exams_schema_workflow_order.sql`
**Problema:** O campo `exam_date` nao estava alinhado com a nomenclatura do formulario de campo (ficha de papel) e nao existiam campos para armazenar os totais calculados (C, P, O, CPOD).
**Causa raiz:** O schema inicial foi modelado com nomes genericos em ingles. Os indices epidemiologicos eram calculados apenas no frontend e nao persistiam no banco, impossibilitando exportacoes corretas sem recalculo.
**Solucao implementada:** Adicionado campo `collection_date` com migracao de dados do antigo `exam_date`. Adicionados campos `c_total`, `p_total`, `o_total` e `cpod_total` na tabela `exams`.
**Impacto:** Exportacao CSV passou a incluir indices pre-calculados, eliminando necessidade de recalculo pos-exportacao.
**Status:** Resolvido.

---

## BUG #003

**Data:** 2026-05-25
**Arquivo:** `supabase/migrations/20260525214911_rename_columns_to_portuguese.sql`
**Problema:** Nomes de colunas em ingles causavam confusao durante a analise dos dados exportados. Pesquisadores esperavam nomes em portugues correspondentes aos campos da ficha de campo.
**Causa raiz:** Schema inicial criado com convencoes de nomenclatura em ingles, incompativel com o contexto de uso academico/epidemiologico brasileiro.
**Solucao implementada:** Todas as colunas foram renomeadas para portugues (ex.: `participant_id` para `participante`, `age` para `idade`, `tooth_number` para `numero_dente`). Operacao estrutural sem perda de dados.
**Impacto:** CSV exportado ficou imediatamente legivel para os pesquisadores sem necessidade de dicionario de traducao.
**Status:** Resolvido.

---

## BUG #004

**Data:** 2026-05-25
**Arquivo:** `src/App.tsx`
**Problema:** Exportacao CSV falhava em dispositivos moveis (Android). O download nao era iniciado em alguns navegadores.
**Causa raiz:** A tecnica de download via criacao de elemento `<a>` com `URL.createObjectURL` nao era suportada de forma confiavel em todos os navegadores moveis.
**Solucao implementada:** Implementada exportacao utilizando Blob com tipo MIME `text/csv;charset=utf-8;` e metodo de download compativel com navegadores moveis via `URL.createObjectURL` seguido de `click()` programatico e `revokeObjectURL` para liberacao de memoria.
**Impacto:** Exportacao funcionando em Android (Chrome e Samsung Internet).
**Status:** Resolvido.

---

## BUG #005

**Data:** 2026-05-29
**Arquivo:** `src/components/IhosSelect.tsx`
**Problema:** O dropdown de selecao do IHOS era cortado quando o componente estava dentro de um container com `overflow: hidden`.
**Causa raiz:** O dropdown era renderizado como filho direto do componente, herdando as restricoes de overflow do container pai.
**Solucao implementada:** Implementado sistema de renderizacao via React Portal (`createPortal`), posicionando o dropdown diretamente no `document.body`. Adicionado rastreamento de posicao do botao e tratamento de scroll/resize para manter o dropdown alinhado ao campo de origem.
**Impacto:** Dropdown IHOS renderiza corretamente em qualquer posicao da tela, sem cortes.
**Status:** Resolvido.

---

## BUG #006

**Data:** 2026-05-29
**Arquivo:** `src/lib/accessTracking.ts`, `src/App.tsx`
**Problema:** Logs de acesso geravam erros silenciosos e impactavam o desempenho em dispositivos moveis de baixa capacidade.
**Causa raiz:** As funcoes de rastreamento faziam chamadas ao Supabase em cada carregamento de pagina e navegacao entre abas, consumindo banda e bateria em contextos de coleta de campo.
**Solucao implementada:** Rastreamento de acesso desabilitado via comentarios no codigo (`ACCESS_TRACKING_DISABLED`). A infraestrutura (tabela `access_logs`, funcoes `logPageLoad` e `logTabNavigation`, componente `AdminPanel`) foi mantida intacta para reativacao futura.
**Impacto:** Reducao de chamadas de rede desnecessarias durante a coleta. Melhoria de desempenho em dispositivos moveis.
**Status:** Resolvido (funcionalidade desabilitada intencionalmente, infraestrutura preservada).

---

## BUG #007

**Data:** 2026-06-04
**Arquivo:** `public/manifest.json`
**Problema:** Chrome Android nao oferecia a opcao de instalacao do PWA. O evento `beforeinstallprompt` nao era disparado.
**Causa raiz:** Multiplas causas combinadas: (1) campo `scope` ausente no manifest, (2) `display` estava configurado como `"browser"` em vez de `"standalone"`, (3) `theme_color` divergia entre o manifest e as meta tags do HTML.
**Solucao implementada:** Adicionado campo `"scope": "/"`, corrigido `display` para `"standalone"`, unificado `theme_color` para `#0f766e` em todos os locais (manifest e meta tag HTML).
**Impacto:** PWA passou a atender todos os criterios de instalabilidade do Chrome.
**Status:** Resolvido.

---

## BUG #008

**Data:** 2026-06-04
**Arquivo:** `public/sw.js`
**Problema:** Service Worker nao fornecia resposta offline para navegacao. O Chrome exige capacidade offline para disparar `beforeinstallprompt`.
**Causa raiz:** O Service Worker anterior usava estrategia network-first mas nao retornava nenhuma pagina cacheada quando a rede falhava em requisicoes de navegacao. O `fetch` handler simplesmente falhava silenciosamente.
**Solucao implementada:** Service Worker reescrito com: (1) pre-cache de assets estaticos na instalacao, (2) estrategia network-first para navegacao com fallback para `/index.html` cacheado, (3) estrategia stale-while-revalidate para assets estaticos, (4) exclusao explicita de chamadas ao Supabase do cache.
**Impacto:** Aplicacao carrega mesmo sem conexao. Criterio de offline do Chrome atendido.
**Status:** Resolvido.

---

## BUG #009

**Data:** 2026-06-04
**Arquivo:** `src/components/InstallBanner.tsx`
**Problema:** O evento `beforeinstallprompt` era perdido quando disparado antes da montagem do componente React.
**Causa raiz:** O listener do evento era registrado dentro de um `useEffect`, que executa apos a montagem do componente. Se o navegador disparava o evento antes do React completar a hidratacao, o prompt era perdido irreversivelmente.
**Solucao implementada:** Listener global registrado no nivel do modulo (fora do componente React), armazenando o evento em uma variavel de modulo (`savedPromptEvent`). O hook `useInstallPrompt` verifica tanto o estado local quanto a variavel global.
**Impacto:** Evento de instalacao capturado em 100% dos casos, independente do timing de montagem do React.
**Status:** Resolvido.

---

## BUG #010

**Data:** 2026-06-04
**Arquivo:** `src/components/InstallBanner.tsx`
**Problema:** Erro de build: `Multiple exports with the same name "InstallBanner"` e `Multiple exports with the same name "InstallHeaderButton"`.
**Causa raiz:** O linter adicionou automaticamente uma linha `export { InstallBanner, InstallHeaderButton }` no final do arquivo, duplicando as exportacoes `export function` que ja existiam nos componentes.
**Solucao implementada:** Removida a linha de exportacao duplicada no final do arquivo, mantendo apenas as exportacoes inline (`export function`).
**Impacto:** Build voltou a compilar corretamente sem erros.
**Status:** Resolvido.

---

## BUG #011 (Monitoramento)

**Data:** Identificado em 2026-05-29
**Arquivo:** `supabase/functions/save-clinical-exam/index.ts`
**Problema:** Divergencia de validacao entre frontend e backend. O frontend aceita idade de 0 a 150, enquanto o backend valida de 0 a 120. O campo `escola` e opcional no frontend mas obrigatorio no backend.
**Causa raiz:** Regras de validacao definidas independentemente no frontend e no backend sem documento unico de referencia.
**Solucao implementada:** Documentada a divergencia no relatorio de validacao metodologica. Correcao adiada para a proxima versao para evitar quebra de fluxo durante coletas em andamento.
**Impacto:** Exames com idade entre 121 e 150 ou sem escola preenchida podem ser rejeitados pelo backend mesmo passando na validacao do frontend.
**Status:** Monitoramento.

---

## BUG #012 (Monitoramento)

**Data:** Identificado em 2026-05-29
**Arquivo:** `src/App.tsx`, `supabase/functions/save-clinical-exam/index.ts`
**Problema:** O limiar de idade para inclusao do codigo 5 no calculo do componente P (Perdidos) do CPOD esta definido como 30 anos, quando o padrao SBBrasil 2010 recomenda 35 anos.
**Causa raiz:** Divergencia na interpretacao dos criterios epidemiologicos durante a implementacao inicial.
**Solucao implementada:** Documentada no relatorio de validacao metodologica. Aguardando decisao da equipe de pesquisa para ajuste do limiar.
**Impacto:** Em populacoes de 30 a 34 anos, o componente P pode ser superestimado, incluindo perdas por motivos outros que carie.
**Status:** Monitoramento.

---

## BUG #013 (Monitoramento)

**Data:** Identificado em 2026-05-29
**Arquivo:** `src/App.tsx`
**Problema:** O IHOS total e armazenado como 0 em vez de NULL quando nenhum dente e registrado (todos com codigo 9).
**Causa raiz:** O payload de salvamento usa `ihosTotal ?? 0` como fallback, convertendo `null` para `0`. Um IHOS de 0.00 (higiene perfeita) e indistinguivel de "nao avaliado".
**Solucao implementada:** Documentada no relatorio de validacao. Correcao planejada para proxima versao.
**Impacto:** Analises epidemiologicas podem erroneamente classificar pacientes nao avaliados como tendo higiene oral perfeita.
**Status:** Monitoramento.

---

## Resumo Estatistico

| Categoria          | Total |
|--------------------|-------|
| Bugs resolvidos    | 10    |
| Em monitoramento   | 3     |
| Total registrado   | 13    |
