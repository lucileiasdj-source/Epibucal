# HISTORICO TECNICO — SaudeBucalApp

Documentacao das principais decisoes de desenvolvimento, problemas enfrentados, solucoes adotadas e licoes aprendidas durante a construcao do SaudeBucalApp (PROFSMOC II).

---

## 1. Visao Geral do Projeto

**Objetivo:** Plataforma de coleta de dados epidemiologicos em saude bucal para pesquisa clinica de campo, projetada para uso em tablets e celulares por examinadores em escolas e unidades de saude.

**Periodo de desenvolvimento:** Maio a Junho de 2026.

**Stack tecnologico:**
- Frontend: React 18, TypeScript, Tailwind CSS, Vite
- Backend: Supabase (PostgreSQL + Edge Functions + RLS)
- Icones: Lucide React
- Deploy: Bolt/Netlify com HTTPS automatico

---

## 2. Decisoes Arquiteturais

### 2.1. Aplicacao Single-Page sem roteamento

**Decisao:** Toda a aplicacao vive em um unico componente (`App.tsx`) com navegacao por scroll entre secoes.

**Justificativa:** O formulario de exame clinico e um fluxo linear continuo. Roteamento por paginas quebraria o fluxo natural do examinador, que preenche de cima para baixo seguindo a ficha de campo. A navegacao sticky permite saltar entre secoes sem perder contexto.

**Tradeoff:** O arquivo `App.tsx` ficou extenso (~1200 linhas). Em uma evolucao futura, os grupos de secoes podem ser extraidos em componentes separados, mas a prioridade foi manter a simplicidade do fluxo de dados (todos os estados no mesmo nivel).

### 2.2. Supabase como backend unico

**Decisao:** Usar Supabase para banco de dados, autenticacao futura, RLS e Edge Functions.

**Justificativa:** Infraestrutura gerenciada sem necessidade de servidor proprio. Edge Functions permitem validacao server-side segura. RLS garante politicas de acesso no nivel do banco.

**Tradeoff:** Dependencia de servico externo. Mitigado pelo Service Worker que permite uso offline com sincronizacao posterior.

### 2.3. Acesso anonimo (sem autenticacao)

**Decisao:** Remover a exigencia de login e permitir acesso publico ao formulario.

**Justificativa:** Contexto de coleta de campo com multiplos examinadores usando dispositivos compartilhados. A autenticacao criava barreira operacional inaceitavel (senhas esquecidas, sessoes expiradas durante coleta).

**Tradeoff:** Sem autenticacao, qualquer pessoa com o link pode inserir dados. Politicas de DELETE foram removidas para evitar exclusao acidental. A funcao `delete-all-exams` usa service role key como controle administrativo.

**Mitigacao futura:** Autenticacao planejada para versoes futuras com suporte multi-usuario e audit trail.

### 2.4. Validacao dual (frontend + backend)

**Decisao:** Validar dados tanto no frontend (`validateForm`) quanto no backend (`save-clinical-exam` Edge Function).

**Justificativa:** Frontend valida para UX imediata (feedback rapido). Backend valida para integridade dos dados (protecao contra manipulacao direta de API).

**Problema encontrado:** Divergencias entre as regras de validacao dos dois lados (idade 0-150 vs 0-120, escola opcional vs obrigatoria). Documentado no Bug Log como item de monitoramento.

### 2.5. Nomenclatura do banco em portugues

**Decisao:** Renomear todas as colunas para portugues na migracao `20260525214911`.

**Justificativa:** O CSV exportado e utilizado diretamente por pesquisadores brasileiros em softwares estatisticos (SPSS, R, Stata). Nomes em portugues eliminam a etapa de traducao manual.

**Tradeoff:** Convencao de codigo mista (variaveis React em ingles, colunas do banco em portugues). Aceitavel dado o publico-alvo exclusivamente lusofono.

### 2.6. Calculos epidemiologicos no frontend

**Decisao:** Calcular CPOD, IHOS e indices derivados no frontend via `useMemo`, enviando os totais calculados junto com os dados brutos.

**Justificativa:** Feedback visual em tempo real para o examinador (resumo epidemiologico atualiza conforme preenche). Os totais sao persistidos no banco para evitar recalculo na exportacao.

**Tradeoff:** Logica de calculo duplicada entre frontend e possivel validacao futura. Mitigado pelo fato de que os dados brutos (codigos por dente) tambem sao persistidos, permitindo recalculo independente.

### 2.7. PWA com Service Worker manual

**Decisao:** Implementar Service Worker manualmente em vez de usar bibliotecas como Workbox.

**Justificativa:** O app tem poucos assets estaticos e um fluxo de cache simples. Workbox adicionaria uma dependencia desnecessaria. O SW manual permite controle fino sobre quais requisicoes cachear (exclui chamadas Supabase) e qual estrategia usar por tipo de recurso.

**Estrategias implementadas:**
- Navegacao: Network-first com fallback para `/index.html` cacheado.
- Assets (JS/CSS): Stale-while-revalidate (entrega rapida do cache, atualiza em background).
- API Supabase: Sempre network (nunca cacheado).

---

## 3. Problemas Enfrentados e Solucoes

### 3.1. Dropdown IHOS cortado por overflow

**Problema:** O componente `<select>` padrao e dropdowns customizados eram cortados quando renderizados dentro de containers com `overflow: hidden`.

**Investigacao:** Tentativas de usar `z-index` e `overflow: visible` nos containers pais falharam porque a hierarquia de stacking context do CSS nao permite que um filho escape do clipping de um pai com overflow controlado.

**Solucao:** Implementado React Portal (`createPortal(dropdown, document.body)`) para renderizar o dropdown fora da arvore DOM do formulario. Rastreamento de posicao via `getBoundingClientRect()` com listeners de scroll e resize.

**Licao aprendida:** Em interfaces com muitos niveis de aninhamento e overflow controlado, portals sao a unica solucao confiavel para elementos flutuantes.

### 3.2. Evento beforeinstallprompt perdido

**Problema:** O Chrome disparava o `beforeinstallprompt` antes do React completar a montagem dos componentes. O listener registrado em `useEffect` nao capturava o evento.

**Investigacao:** O evento e disparado uma unica vez pelo navegador. Se nao houver listener no momento exato, ele e perdido sem possibilidade de recuperacao.

**Solucao:** Registrar o listener no nivel do modulo (fora de qualquer componente), armazenando o evento em variavel de modulo. O hook React verifica tanto o estado local quanto a variavel global.

**Licao aprendida:** Eventos criticos do navegador que disparam uma unica vez devem ser capturados o mais cedo possivel no ciclo de vida da aplicacao, idealmente antes da inicializacao do framework.

### 3.3. Service Worker sem suporte offline

**Problema:** O Chrome exige que o PWA funcione offline para oferecer instalacao. O Service Worker inicial nao retornava nenhuma resposta quando a rede falhava.

**Investigacao:** O handler de fetch anterior verificava `response.type === 'basic'` para decidir se cacheava, mas nao tinha logica de fallback para navegacao offline.

**Solucao:** Separar o tratamento de `navigate` requests (paginas) de requests de assets. Para navegacao, tentar rede primeiro e cair para `/index.html` cacheado. Para assets, usar stale-while-revalidate.

**Licao aprendida:** O requisito offline do Chrome para PWA nao exige que toda a aplicacao funcione offline — basta que o Service Worker retorne uma resposta valida (mesmo que seja uma pagina de fallback) em vez de um erro de rede.

### 3.4. Exportacao duplicada por linter

**Problema:** O linter do projeto adicionou automaticamente `export { InstallBanner, InstallHeaderButton }` no final do arquivo, duplicando as exportacoes `export function` existentes.

**Investigacao:** O erro de build `Multiple exports with the same name` indicava claramente a duplicacao.

**Solucao:** Remover a linha adicionada pelo linter, mantendo apenas as exportacoes inline.

**Licao aprendida:** Ferramentas de auto-fix (linters, formatters) podem introduzir bugs quando o estilo de exportacao do arquivo nao corresponde as regras configuradas. Sempre verificar o build apos auto-fixes.

### 3.5. RLS bloqueando acesso anonimo

**Problema:** Apos a criacao inicial das tabelas com RLS para `authenticated`, a aplicacao nao conseguia salvar dados porque operava sem autenticacao.

**Investigacao:** Os logs do Supabase mostravam erros de permissao (RLS policy violation).

**Solucao:** Criada migracao especifica removendo politicas `authenticated` e criando politicas publicas. DELETE mantido bloqueado intencionalmente.

**Licao aprendida:** Ao projetar politicas RLS, considerar o modelo de acesso real da aplicacao desde o inicio. Mudar de `authenticated` para `anon` posteriormente requer migracao cuidadosa.

---

## 4. Padroes e Convencoes Adotados

### 4.1. Codigos epidemiologicos
- Baseados na OMS (WHO Oral Health Surveys, 5th edition, 2013) e SBBrasil 2010.
- Codigo 9 utilizado universalmente como "Nao registrado" (valor padrao).
- Codigos de condicao da coroa: 0-9 com mapeamento de cores consistente.

### 4.2. Identificacao visual por cores
- Cada codigo possui um par de cores (fundo + borda) definido em records TypeScript.
- Gradiente semantico: verde (saude) → amarelo (atencao) → vermelho (problema).

### 4.3. Migracao de dados
- Todas as migracoes usam `IF NOT EXISTS` / `IF EXISTS` para idempotencia.
- Comentarios descritivos em cada migracao explicando o que e por que.
- Dados existentes preservados em todas as migracoes (sem DROP, sem DELETE).

### 4.4. Edge Functions
- CORS habilitado em todas as funcoes (origin `*`).
- Validacao completa no servidor com mensagens em portugues.
- Service role key para operacoes administrativas.
- Try-catch global em todas as funcoes.

---

## 5. Licoes Aprendidas

### 5.1. Coleta de campo exige simplicidade radical
Cada clique adicional, cada tela de login, cada confirmacao desnecessaria reduz a qualidade dos dados coletados. Examinadores preenchendo fichas em escolas com criancas inquietas precisam de um fluxo ininterrupto.

### 5.2. Validacao deve ser definida em documento unico
A divergencia de regras entre frontend e backend (idade, escola) so foi descoberta na validacao metodologica. Um schema compartilhado (ex.: JSON Schema ou Zod) evitaria inconsistencias.

### 5.3. Nomenclatura deve seguir o publico-alvo
A decisao de renomear colunas para portugues, embora contrarie convencoes de engenharia, foi correta para o contexto. Pesquisadores nao devem precisar de dicionario para analisar os dados.

### 5.4. Desabilitar e diferente de remover
O rastreamento de acesso foi desabilitado (comentado) em vez de removido. Isso preservou a infraestrutura completa (tabela, funcoes, painel admin) para reativacao futura sem retrabalho.

### 5.5. PWA requer atencao aos detalhes
A instalabilidade do PWA depende de uma combinacao precisa de manifest, Service Worker, HTTPS e meta tags. Um unico campo ausente (`scope`) ou uma estrategia de cache incompleta pode bloquear toda a funcionalidade de instalacao.

### 5.6. Testes de exportacao devem incluir dispositivos moveis
A exportacao CSV que funcionava no desktop falhava em navegadores moveis. Testes de funcionalidades de download devem sempre incluir Chrome Android e Samsung Internet.

---

## 6. Arquitetura Atual

```
SaudeBucalApp
├── Frontend (React + Vite)
│   ├── App.tsx ................ Formulario principal (1200 linhas)
│   ├── InstallBanner.tsx ...... PWA install prompt
│   ├── IhosSelect.tsx ......... Dropdown IHOS com portal
│   ├── AdminPanel.tsx ......... Painel admin (desabilitado)
│   └── lib/
│       ├── supabase.ts ........ Cliente Supabase singleton
│       └── accessTracking.ts .. Rastreamento (desabilitado)
│
├── Backend (Supabase)
│   ├── Tabelas
│   │   ├── exams .............. Dados do exame (30+ colunas)
│   │   ├── tooth_records ...... Codigos por dente (FK → exams)
│   │   └── access_logs ........ Logs de acesso anonimos
│   │
│   └── Edge Functions
│       ├── save-clinical-exam . Validacao + insercao
│       └── delete-all-exams ... Exclusao administrativa
│
├── PWA
│   ├── manifest.json .......... Configuracao do app
│   ├── sw.js .................. Service Worker offline
│   └── imagemicone.png ........ Icone 192/512px
│
└── Documentacao
    ├── CHANGELOG.md ........... Historico de versoes
    ├── BUG_LOG.md ............. Registro de bugs
    ├── TECHNICAL_HISTORY.md ... Este documento
    ├── MANUAL_ILUSTRADO.md .... Guia visual do usuario
    ├── MANUAL_TECNICO_OPERACIONAL.md .. Manual tecnico
    ├── RELATORIO_VALIDACAO_METODOLOGICA.md .. Validacao OMS/SBBrasil
    └── AUDITORIA_IHOS_DENTES_SUBSTITUTOS.md .. Auditoria IHOS
```

---

## 7. Proximos Passos Planejados

1. Unificar regras de validacao frontend/backend via schema compartilhado.
2. Ajustar limiar de idade para codigo 5 no CPOD (30 → 35 anos, conforme SBBrasil 2010).
3. Implementar dentes substitutos no IHOS conforme regra de Greene & Vermillion.
4. Armazenar `ihos_total` como NULL quando nenhum dente for registrado.
5. Implementar autenticacao para controle de acesso multi-usuario.
6. Adicionar sincronizacao offline com fila de envio.
7. Dashboard de analise estatistica com graficos.
8. Conformidade LGPD para dados sensiveis.
9. Reativar rastreamento de acesso com otimizacoes de desempenho.
