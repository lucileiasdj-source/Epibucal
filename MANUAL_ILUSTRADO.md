# MANUAL TÉCNICO E OPERACIONAL ILUSTRADO
## EpiBucal — Sistema de Coleta Epidemiológica em Saúde Bucal
### Versão 1.0 Ilustrada · Junho de 2026

---

> **Classificação:** Documento de uso acadêmico e institucional
> **Uso autorizado:** UniOpen, projetos de pesquisa, registro de software, treinamento de examinadores
>
> **Nota sobre as figuras:** Este manual indica exatamente quais capturas de tela devem ser inseridas em cada posição, com legendas acadêmicas padronizadas. Os marcadores `[FIGURA X.X]` indicam o ponto de inserção da imagem e as instruções de captura.

---

## SUMÁRIO DE FIGURAS

| Figura | Descrição | Seção |
|--------|-----------|-------|
| Figura 1.1 | Tela inicial do EpiBucal — visão geral do formulário | Sec. 1 |
| Figura 1.2 | Cabeçalho com indicadores CPOD e IHOS em tempo real | Sec. 1 |
| Figura 3.1 | Barra de navegação por seções (menu sticky) | Sec. 3 |
| Figura 4.1 | Diagrama de arquitetura do sistema | Sec. 4 |
| Figura 5.1 | Diagrama entidade-relacionamento do banco de dados | Sec. 5 |
| Figura 7.1 | Fluxograma completo do processo de exame | Sec. 7 |
| Figura 8.1 | Seção de Identificação do Participante | Sec. 8 |
| Figura 8.2 | Seção IHOS — Grade dos 6 dentes índice | Sec. 8 |
| Figura 8.3 | Painel de resultado do IHOS com classificação | Sec. 8 |
| Figura 8.4 | Seção Condição da Coroa — Arcada Superior | Sec. 8 |
| Figura 8.5 | Seção Condição da Coroa — Arcada Inferior | Sec. 8 |
| Figura 8.6 | Painel lateral com cálculo CPOD em tempo real | Sec. 8 |
| Figura 8.7 | Seção Uso de Prótese — Superior e Inferior | Sec. 8 |
| Figura 8.8 | Seção Necessidade de Prótese — Superior e Inferior | Sec. 8 |
| Figura 8.9 | Seção Urgência de Tratamento | Sec. 8 |
| Figura 8.10 | Seção Resumo — Painel consolidado de indicadores | Sec. 8 |
| Figura 8.11 | Botões de ação: Salvar, Exportar CSV, Limpar | Sec. 8 |
| Figura 8.12 | Modal de confirmação de exclusão de exames | Sec. 8 |
| Figura 9.1 | Notificação de erro de validação do formulário | Sec. 9 |
| Figura 9.2 | Notificação de sucesso após salvamento | Sec. 9 |
| Figura 10.1 | Contadores C, P, O e CPOD em tempo real no resumo | Sec. 10 |
| Figura 11.1 | Barra do IHOS com classificação Boa (verde) | Sec. 11 |
| Figura 11.2 | Barra do IHOS com classificação Regular (amarelo) | Sec. 11 |
| Figura 11.3 | Barra do IHOS com classificação Necessita Melhoria (vermelho) | Sec. 11 |
| Figura 14.1 | Arquivo CSV aberto no Microsoft Excel | Sec. 14 |
| Figura 18.1 | Fluxo operacional resumido para examinadores | Sec. 18 |

---

## SUMÁRIO DE TABELAS

| Tabela | Descrição | Seção |
|--------|-----------|-------|
| Tabela 1.1 | Tecnologias utilizadas no sistema | Sec. 1 |
| Tabela 3.1 | Funcionalidades implementadas | Sec. 3 |
| Tabela 4.1 | Componentes do sistema e responsabilidades | Sec. 4 |
| Tabela 5.1 | Estrutura da tabela `exams` | Sec. 5 |
| Tabela 5.2 | Estrutura da tabela `tooth_records` | Sec. 5 |
| Tabela 5.3 | Estrutura da tabela `access_logs` | Sec. 5 |
| Tabela 5.4 | Políticas de segurança RLS | Sec. 5 |
| Tabela 6.1 | Variáveis de identificação do participante | Sec. 6 |
| Tabela 6.2 | Códigos de condição da coroa dentária | Sec. 6 |
| Tabela 6.3 | Dentes examinados por arcada (numeração FDI) | Sec. 6 |
| Tabela 6.4 | Variáveis e escores do IHOS | Sec. 6 |
| Tabela 6.5 | Códigos de uso de prótese | Sec. 6 |
| Tabela 6.6 | Códigos de necessidade de prótese | Sec. 6 |
| Tabela 6.7 | Códigos de urgência de tratamento | Sec. 6 |
| Tabela 6.8 | Variáveis calculadas do CPOD | Sec. 6 |
| Tabela 9.1 | Regras de validação do frontend | Sec. 9 |
| Tabela 9.2 | Regras de validação do backend | Sec. 9 |
| Tabela 14.1 | Colunas do arquivo CSV exportado (56 colunas) | Sec. 14 |
| Tabela 15.1 | Indicadores de qualidade e consistência dos dados | Sec. 15 |
| Tabela 16.1 | Limitações atuais do sistema | Sec. 16 |
| Tabela 17.1 | Melhorias futuras planejadas | Sec. 17 |
| Tabela 18.1 | Erros comuns e soluções para examinadores | Sec. 18 |
| Tabela 20.1 | Referências metodológicas utilizadas | Sec. 20 |
| Tabela A.1 | Codificação completa dos 32 dentes (FDI) | Apêndice A |

---

## 1. APRESENTAÇÃO DO SISTEMA

O **EpiBucal** é uma plataforma digital de coleta de dados epidemiológicos em saúde bucal, desenvolvida para apoiar pesquisas de campo e levantamentos populacionais. O sistema digitaliza e estrutura o processo de exame clínico odontológico, permitindo o registro padronizado de indicadores como o Índice CPOD (Cariados, Perdidos e Obturados) e o IHOS (Índice de Higiene Oral Simplificado), além de condições de prótese e necessidade de tratamento.

A plataforma foi projetada com foco em **usabilidade em campo**, priorizando o uso em tablets e dispositivos móveis durante a realização de exames clínicos em ambiente escolar, unidades de saúde ou eventos institucionais como a **UniOpen**.

---

### [FIGURA 1.1]

> **Como capturar:** Acesse o aplicativo em um navegador em modo desktop (largura ≥ 1024 px). Capture a tela completa sem nenhum campo preenchido, mostrando o formulário em estado inicial (todos os valores em branco ou com padrão 9).

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPTURA DE TELA — FIGURA 1.1                                   │
│                                                                 │
│  O QUE CAPTURAR:                                                │
│  • Tela completa do aplicativo (scroll do topo)                 │
│  • Cabeçalho "Exame Clínico" visível                            │
│  • Indicadores CPOD e IHOS no topo mostrando "--"               │
│  • Barra de navegação com as 7 seções                           │
│  • Início da seção "Identificação" abaixo                       │
│                                                                 │
│  DISPOSITIVO RECOMENDADO: Desktop (1280 × 800 px)               │
│  ZOOM DO NAVEGADOR: 100%                                        │
└─────────────────────────────────────────────────────────────────┘
```

**Figura 1.1** — Interface inicial do EpiBucal exibindo o formulário de exame clínico epidemiológico em estado inicial, com indicadores CPOD e IHOS ainda sem valores registrados. A barra de navegação superior permite acesso rápido às sete seções do formulário. Fonte: Elaborado pelos autores (2026).

---

### [FIGURA 1.2]

> **Como capturar:** Preencha ao menos 3 dentes com códigos diferentes (ex.: 16=1, 11=3, 26=4) e registre ao menos 2 escores IHOS. Capture apenas o cabeçalho do formulário onde aparecem os indicadores em tempo real.

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPTURA DE TELA — FIGURA 1.2                                   │
│                                                                 │
│  O QUE CAPTURAR:                                                │
│  • Recorte do topo da tela (altura ~120 px)                     │
│  • Cartão "CPOD" mostrando valor > 0 (ex.: 3)                   │
│  • Cartão "IHOS" mostrando valor decimal (ex.: 1.50)            │
│  • Fundo teal/verde do cabeçalho                                │
│                                                                 │
│  ESTADO DO FORMULÁRIO ANTES DA CAPTURA:                         │
│  • Dente 16 = código 1 (Cariado)                                │
│  • Dente 11 = código 3 (Restaurado)                             │
│  • Dente 26 = código 4 (Perdido)                                │
│  • IHOS dente 16 = 1, IHOS dente 11 = 2                        │
└─────────────────────────────────────────────────────────────────┘
```

**Figura 1.2** — Detalhe do cabeçalho do EpiBucal com indicadores CPOD e IHOS atualizados em tempo real durante o preenchimento do formulário. Os valores são recalculados automaticamente a cada interação do examinador, sem necessidade de confirmação. Fonte: Elaborado pelos autores (2026).

---

**Tabela 1.1** — Tecnologias utilizadas no desenvolvimento do EpiBucal e suas respectivas funções na arquitetura do sistema.

| Camada | Tecnologia | Versão | Função |
|--------|------------|--------|--------|
| Frontend | React + TypeScript | 18.3 / 5.5 | Interface de usuário e lógica de exibição |
| Estilo | Tailwind CSS | 3.4 | Sistema de design responsivo utilitário |
| Ícones | Lucide React | 0.344 | Iconografia padronizada |
| Backend | Supabase Edge Functions (Deno) | 2.x | Validação e persistência de dados |
| Banco de dados | PostgreSQL (Supabase) | 15 | Armazenamento relacional com RLS |
| Build | Vite | 5.4 | Empacotamento e otimização do frontend |

Fonte: Elaborado pelos autores com base no arquivo `package.json` do projeto (2026).

---

## 2. OBJETIVOS

### 2.1 Objetivo Geral

Prover uma ferramenta digital padronizada para coleta, armazenamento e exportação de dados epidemiológicos em saúde bucal, seguindo os critérios da Organização Mundial da Saúde (OMS/2013) e do Ministério da Saúde do Brasil (SBBrasil 2010).

### 2.2 Objetivos Específicos

- Digitalizar o formulário de exame clínico epidemiológico em saúde bucal
- Calcular automaticamente os índices CPOD e IHOS em tempo real durante o exame
- Registrar dados de uso e necessidade de prótese dentária
- Registrar a necessidade de tratamento com urgência
- Armazenar os registros em banco de dados relacional com segurança
- Exportar os dados coletados em formato CSV compatível com softwares de análise estatística (SPSS, R, Excel)
- Suportar múltiplos examinadores e múltiplas datas de coleta
- Garantir rastreabilidade e integridade dos dados coletados

---

## 3. FUNCIONALIDADES IMPLEMENTADAS

### [FIGURA 3.1]

> **Como capturar:** Capture apenas a barra de navegação horizontal do topo do formulário, mostrando os 7 botões de seção com seus ícones e rótulos.

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPTURA DE TELA — FIGURA 3.1                                   │
│                                                                 │
│  O QUE CAPTURAR:                                                │
│  • Faixa horizontal com os 7 botões de seção                    │
│  • Ícones visíveis: User, ClipboardList, Tooth, Smile,          │
│    Activity, ShieldAlert, Calculator                            │
│  • Rótulos: Identificação | IHOS | Condição da Coroa |          │
│    Uso de Prótese | Necess. Prótese | Urgência | Resumo         │
│  • Um dos botões deve estar destacado (seção ativa)             │
│                                                                 │
│  ESTADO: qualquer seção ativa serve para a captura              │
└─────────────────────────────────────────────────────────────────┘
```

**Figura 3.1** — Barra de navegação por seções do EpiBucal. O componente é fixo ao topo da tela durante a rolagem (*sticky*), permitindo ao examinador navegar entre as sete seções do formulário sem perder o contexto visual. O botão da seção ativa é exibido com destaque visual. Fonte: Elaborado pelos autores (2026).

---

**Tabela 3.1** — Funcionalidades implementadas no EpiBucal, versão 1.0.

| # | Funcionalidade | Seção do formulário | Status |
|---|---------------|---------------------|--------|
| 1 | Identificação do participante | 1 — Identificação | Implementado |
| 2 | Exame de higiene oral (IHOS) | 2 — IHOS | Implementado |
| 3 | Condição da coroa dentária (32 dentes) | 3 — Condição da Coroa | Implementado |
| 4 | Uso de prótese (superior e inferior) | 4 — Uso de Prótese | Implementado |
| 5 | Necessidade de prótese (superior e inferior) | 5 — Necess. Prótese | Implementado |
| 6 | Urgência de tratamento | 6 — Urgência | Implementado |
| 7 | Cálculo automático do CPOD | Cabeçalho + Resumo | Implementado |
| 8 | Cálculo automático do IHOS | Seção IHOS + Resumo | Implementado |
| 9 | Resumo visual consolidado | 7 — Resumo | Implementado |
| 10 | Salvamento em banco de dados (nuvem) | Botão de ação | Implementado |
| 11 | Exportação CSV de todos os exames | Botão de ação | Implementado |
| 12 | Exclusão de registros com confirmação dupla | Botão de ação | Implementado |
| 13 | Validação em duas camadas (frontend + backend) | Automático | Implementado |
| 14 | Painel administrativo de auditoria de acesso | Componente separado | Desabilitado* |
| 15 | Navegação por seções (menu sticky) | Toda a tela | Implementado |

*O painel administrativo está implementado em `AdminPanel.tsx`, mas desabilitado por padrão no código de produção.

Fonte: Elaborado pelos autores com base no código-fonte do projeto (2026).

---

## 4. ARQUITETURA DO SISTEMA

### [FIGURA 4.1]

> **Como capturar:** Esta figura é um diagrama — não é uma captura de tela do aplicativo. Utilize o diagrama abaixo para criar uma versão gráfica com Lucidchart, Draw.io, Figma ou ferramenta equivalente.

```
┌─────────────────────────────────────────────────────────────────┐
│  DIAGRAMA — FIGURA 4.1                                          │
│  (Reproduzir como figura vetorial em ferramenta de diagramas)   │
│                                                                 │
│  NAVEGADOR (React SPA)                                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  App.tsx                    AdminPanel.tsx               │   │
│  │  ┌─────────────────┐       ┌──────────────────────────┐  │   │
│  │  │ Formulário de   │       │ Painel de Auditoria      │  │   │
│  │  │ Exame Clínico   │       │ (desabilitado)           │  │   │
│  │  └────────┬────────┘       └──────────────────────────┘  │   │
│  │           │ supabase.ts (cliente SDK)                     │   │
│  └───────────┼──────────────────────────────────────────────┘   │
│              │ HTTPS / REST                                     │
│     ┌────────┴──────────────┐                                   │
│     ▼                       ▼                                   │
│  Edge Functions           PostgreSQL                            │
│  save-clinical-exam  ◄──► exams                                 │
│  delete-all-exams         tooth_records                         │
│                            access_logs                          │
└─────────────────────────────────────────────────────────────────┘
```

**Figura 4.1** — Diagrama de arquitetura do EpiBucal, ilustrando as três camadas do sistema: interface de usuário (React SPA), funções serverless (Supabase Edge Functions em Deno) e banco de dados relacional (PostgreSQL com Row Level Security). A comunicação entre camadas ocorre via protocolo HTTPS com autenticação por token anônimo. Fonte: Elaborado pelos autores (2026).

---

**Tabela 4.1** — Componentes do sistema EpiBucal, suas localizações no projeto e respectivas responsabilidades.

| Componente | Arquivo | Responsabilidade |
|------------|---------|-----------------|
| Interface principal | `src/App.tsx` | Formulário completo, cálculos em tempo real, exportação |
| Painel administrativo | `src/components/AdminPanel.tsx` | Auditoria de acesso (desabilitado por padrão) |
| Cliente do banco | `src/lib/supabase.ts` | Instância singleton do cliente Supabase |
| Rastreamento de acesso | `src/lib/accessTracking.ts` | Registro de eventos de uso (desabilitado) |
| Salvar exame | `supabase/functions/save-clinical-exam/index.ts` | Validação backend + persistência |
| Excluir exames | `supabase/functions/delete-all-exams/index.ts` | Exclusão em massa de registros |

Fonte: Elaborado pelos autores com base na estrutura de arquivos do projeto (2026).

---

## 5. ESTRUTURA DO BANCO DE DADOS

### [FIGURA 5.1]

> **Como capturar:** Esta figura é um diagrama ER — não é uma captura do aplicativo. Reproduzir com ferramenta de modelagem (Draw.io, dbdiagram.io, MySQL Workbench ou equivalente).

```
┌─────────────────────────────────────────────────────────────────┐
│  DIAGRAMA ER — FIGURA 5.1                                       │
│  (Reproduzir como diagrama entidade-relacionamento)             │
│                                                                 │
│  ┌─────────────────────┐       ┌────────────────────────┐      │
│  │       exams          │       │     tooth_records       │      │
│  │─────────────────────│       │────────────────────────│      │
│  │ PK id (UUID)        │◄──1:N─┤ PK id (UUID)           │      │
│  │    participante      │       │ FK exam_id (UUID)      │      │
│  │    idade             │       │    numero_dente (int)  │      │
│  │    sexo              │       │    codigo_coroa (int)  │      │
│  │    escola            │       │    created_at          │      │
│  │    examinador        │       └────────────────────────┘      │
│  │    data_coleta       │                                        │
│  │    ihos_16...46      │       ┌────────────────────────┐      │
│  │    ihos_total        │       │     access_logs         │      │
│  │    uso_protese_*     │       │────────────────────────│      │
│  │    nec_protese_*     │       │ PK id (UUID)           │      │
│  │    urgencia_*        │       │    session_id (text)   │      │
│  │    c/p/o/cpod_total  │       │    event_type (text)   │      │
│  │    created_at        │       │    tab_name (text)     │      │
│  └─────────────────────┘       │    user_agent (text)   │      │
│                                 │    created_at          │      │
│                                 └────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

**Figura 5.1** — Diagrama entidade-relacionamento (ER) do banco de dados do EpiBucal. A tabela `exams` mantém relacionamento 1:N com `tooth_records` por meio de chave estrangeira com exclusão em cascata (`ON DELETE CASCADE`). A tabela `access_logs` é independente e armazena eventos de auditoria de acesso. Fonte: Elaborado pelos autores com base nas migrações SQL do projeto (2026).

---

**Tabela 5.1** — Estrutura da tabela `exams`, responsável pelo armazenamento dos dados gerais de cada exame clínico epidemiológico.

| Coluna | Tipo | Padrão | Obrigatório | Descrição |
|--------|------|--------|-------------|-----------|
| `id` | UUID | gen_random_uuid() | Sim | Identificador único gerado automaticamente |
| `participante` | text | — | Sim | Código ou nome do participante |
| `idade` | integer | — | Sim | Idade em anos completos |
| `sexo` | text | — | Sim | Sexo biológico: "M" ou "F" |
| `escola` | text | — | Não | Local ou nome da escola |
| `examinador` | text | — | Sim | Nome do examinador responsável |
| `data_coleta` | date | — | Sim | Data de realização do exame |
| `ihos_16` | integer | 9 | Sim | Escore IHOS do dente 16 |
| `ihos_11` | integer | 9 | Sim | Escore IHOS do dente 11 |
| `ihos_26` | integer | 9 | Sim | Escore IHOS do dente 26 |
| `ihos_31` | integer | 9 | Sim | Escore IHOS do dente 31 |
| `ihos_36` | integer | 9 | Sim | Escore IHOS do dente 36 |
| `ihos_46` | integer | 9 | Sim | Escore IHOS do dente 46 |
| `ihos_total` | numeric(5,2) | 0 | Sim | Média calculada dos escores IHOS válidos |
| `uso_protese_superior` | integer | 9 | Sim | Código de uso de prótese superior |
| `uso_protese_inferior` | integer | 9 | Sim | Código de uso de prótese inferior |
| `necessidade_protese_superior` | integer | 9 | Sim | Código de necessidade superior |
| `necessidade_protese_inferior` | integer | 9 | Sim | Código de necessidade inferior |
| `urgencia_tratamento` | integer | 9 | Sim | Código de urgência de tratamento |
| `c_total` | integer | 0 | Sim | Total de dentes cariados (componente C) |
| `p_total` | integer | 0 | Sim | Total de dentes perdidos (componente P) |
| `o_total` | integer | 0 | Sim | Total de dentes obturados (componente O) |
| `cpod_total` | integer | 0 | Sim | Índice CPOD total (C + P + O) |
| `created_at` | timestamptz | now() | Auto | Data e hora de criação do registro |

Fonte: Elaborado pelos autores com base na migração `20260521171203_create_dental_exam_tables.sql` (2026).

---

**Tabela 5.2** — Estrutura da tabela `tooth_records`, responsável pelo armazenamento individual do código de condição de cada dente examinado.

| Coluna | Tipo | Padrão | Descrição |
|--------|------|--------|-----------|
| `id` | UUID | gen_random_uuid() | Identificador único do registro dentário |
| `exam_id` | UUID | — | Chave estrangeira → exams(id), ON DELETE CASCADE |
| `numero_dente` | integer | — | Número FDI do dente (11 a 48) |
| `codigo_coroa` | integer | 9 | Código de condição da coroa (0–9) |
| `created_at` | timestamptz | now() | Data e hora de criação |

Nota: Índice `idx_tooth_records_exam_id` criado sobre `exam_id` para otimização de consultas. A cláusula `ON DELETE CASCADE` garante integridade referencial: ao excluir um exame, todos os 32 registros dentários correspondentes são automaticamente removidos.

Fonte: Elaborado pelos autores com base na migração `20260521171203_create_dental_exam_tables.sql` (2026).

---

**Tabela 5.3** — Estrutura da tabela `access_logs`, utilizada para auditoria de acesso e análise de uso da plataforma.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | Identificador único do evento de acesso |
| `session_id` | text | UUID de sessão (gerado no sessionStorage do navegador) |
| `event_type` | text | Tipo de evento: `'page_load'` ou `'tab_navigation'` |
| `tab_name` | text (nullable) | Nome da seção acessada (apenas em tab_navigation) |
| `user_agent` | text | String de identificação do navegador/dispositivo (máx. 512 chars) |
| `created_at` | timestamptz | Data e hora do evento |

Fonte: Elaborado pelos autores com base na migração `20260529121604_create_access_logs_table.sql` (2026).

---

**Tabela 5.4** — Políticas de segurança Row Level Security (RLS) configuradas no banco de dados do EpiBucal.

| Tabela | Operação | Perfil permitido | Justificativa |
|--------|----------|-----------------|---------------|
| `exams` | SELECT | anon + authenticated | Leitura necessária para exportação em campo |
| `exams` | INSERT | anon + authenticated | Inserção necessária sem login prévio |
| `exams` | UPDATE | anon + authenticated | Correção de registros em campo |
| `tooth_records` | SELECT | anon + authenticated | Leitura para exportação |
| `tooth_records` | INSERT | anon + authenticated | Inserção sem autenticação |
| `tooth_records` | UPDATE | anon + authenticated | Correção de registros |
| `access_logs` | INSERT | anon + authenticated | Auditoria de acesso anônimo |
| `access_logs` | SELECT | authenticated only | Visualização restrita ao administrador |

Fonte: Elaborado pelos autores com base na migração `20260521174844_update_rls_for_anonymous_access.sql` (2026).

---

## 6. DICIONÁRIO COMPLETO DE VARIÁVEIS

**Tabela 6.1** — Variáveis de identificação do participante, com nomes internos, colunas no banco de dados, tipos e obrigatoriedade.

| Variável interna | Coluna no BD | Tipo | Obrigatório | Valores válidos |
|-----------------|-------------|------|-------------|-----------------|
| `participantId` | `participante` | string | Sim | Qualquer texto não vazio |
| `age` | `idade` | integer | Sim | 0 a 150 |
| `sex` | `sexo` | "M" \| "F" | Sim | "M" (Masculino) ou "F" (Feminino) |
| `school` | `escola` | string | Não | Qualquer texto |
| `examiner` | `examinador` | string | Sim | Qualquer texto não vazio |
| `examDate` | `data_coleta` | date | Sim | Formato YYYY-MM-DD |

Fonte: Elaborado pelos autores com base no código-fonte `src/App.tsx` (2026).

---

**Tabela 6.2** — Códigos de condição da coroa dentária utilizados no sistema, com descrição epidemiológica e inclusão no índice CPOD.

| Código | Denominação no sistema | Descrição epidemiológica | Componente CPOD |
|--------|----------------------|--------------------------|-----------------|
| 0 | Hígido | Dente sadio, sem lesão de cárie ativa ou tratada | Não compõe |
| 1 | Cariado | Presença de cavidade ativa por cárie | **C** (sempre) |
| 2 | Rest. c/ cárie | Restauração com cárie presente simultaneamente | **O** (sempre) |
| 3 | Rest. s/ cárie | Restauração sem cárie presente | **O** (sempre) |
| 4 | Perdido p/ cárie | Dente ausente por extração motivada por cárie | **P** (sempre) |
| 5 | Perdido outra | Dente ausente por outra causa (periodontal, trauma, ortodôntico) | **P** (apenas se idade ≥ 30 anos) |
| 6 | Selante | Selante de fóssulas e fissuras presente | Não compõe (s_total) |
| 7 | Ponte/Coroa/Impl. | Prótese fixa, coroa unitária ou implante osseointegrado | Não compõe (pr_total) |
| 8 | Não erupcionado | Dente ainda não erupcionado na cavidade bucal | Não compõe |
| 9 | Não registrado | Ausência de registro (valor padrão inicial) | Não compõe |

Fonte: Adaptado de WHO (2013) e implementado em `src/App.tsx` (2026).

---

**Tabela 6.3** — Numeração FDI dos 32 dentes permanentes examinados, organizados por arcada e posição.

| Arcada | Quadrante direito (→ centro) | Quadrante esquerdo (centro →) |
|--------|------------------------------|-------------------------------|
| Superior | 18 · 17 · 16 · 15 · 14 · 13 · 12 · 11 | 21 · 22 · 23 · 24 · 25 · 26 · 27 · 28 |
| Inferior | 48 · 47 · 46 · 45 · 44 · 43 · 42 · 41 | 31 · 32 · 33 · 34 · 35 · 36 · 37 · 38 |

Nota: O sistema utiliza a numeração FDI (Fédération Dentaire Internationale) de dois dígitos. O primeiro dígito indica o quadrante (1=sup. dir., 2=sup. esq., 3=inf. esq., 4=inf. dir.) e o segundo indica a posição (1=central a 8=terceiro molar). Todos os 32 dentes são inicializados com código 9 (não registrado).

Fonte: FDI (1971) apud WHO (2013).

---

**Tabela 6.4** — Variáveis do Índice de Higiene Oral Simplificado (IHOS): dentes índice, superfície avaliada e escores.

| Dente | Variável interna | Coluna no BD | Arcada | Superfície |
|-------|-----------------|-------------|--------|------------|
| 16 | `ihos[16]` | `ihos_16` | Superior direita | Vestibular |
| 11 | `ihos[11]` | `ihos_11` | Superior direita | Vestibular |
| 26 | `ihos[26]` | `ihos_26` | Superior esquerda | Vestibular |
| 31 | `ihos[31]` | `ihos_31` | Inferior esquerda | Lingual |
| 36 | `ihos[36]` | `ihos_36` | Inferior esquerda | Lingual |
| 46 | `ihos[46]` | `ihos_46` | Inferior direita | Lingual |

**Escores IHOS:**

| Escore | Descrição | Critério clínico |
|--------|-----------|-----------------|
| 0 | Sem placa | Superfície livre de detritos ou pigmentação |
| 1 | Até 1/3 | Placa/detritos em até 1/3 da superfície coronária |
| 2 | 1/3 a 2/3 | Placa/detritos entre 1/3 e 2/3 da superfície |
| 3 | Mais de 2/3 | Placa/detritos em mais de 2/3 da superfície |
| 9 | Não registrado | Dente ausente ou impossibilidade de registro (excluído da média) |

Fonte: Greene e Vermillion (1964) apud WHO (2013).

---

**Tabela 6.5** — Códigos de uso de prótese, aplicados separadamente para as arcadas superior e inferior.

| Código | Descrição | Variável superior | Variável inferior |
|--------|-----------|------------------|------------------|
| 0 | Sem prótese | `upperProsthesisUse` → `uso_protese_superior` | `lowerProsthesisUse` → `uso_protese_inferior` |
| 1 | Prótese parcial removível ou fixa | — | — |
| 2 | Prótese total (completa) | — | — |
| 9 | Não registrado (padrão) | — | — |

Fonte: WHO (2013).

---

**Tabela 6.6** — Códigos de necessidade de prótese, aplicados separadamente para as arcadas superior e inferior.

| Código | Descrição |
|--------|-----------|
| 0 | Sem necessidade de prótese |
| 1 | Necessita reposição de 1 elemento |
| 2 | Necessita reposição de mais de 1 elemento |
| 3 | Necessita prótese total |
| 9 | Não registrado (padrão) |

Fonte: WHO (2013).

---

**Tabela 6.7** — Códigos de urgência de tratamento utilizados no EpiBucal.

| Código | Descrição | Definição clínica |
|--------|-----------|------------------|
| 0 | Sem necessidade | Ausência de condições que requeiram tratamento imediato ou eletivo |
| 1 | Preventivo | Necessidade de orientações de higiene, aplicação de flúor, selantes |
| 2 | Eletivo | Tratamento necessário, porém sem caráter de urgência imediata |
| 3 | Urgente | Dor, infecção ativa, traumatismo recente, comprometimento sistêmico |
| 9 | Não registrado (padrão) | Avaliação de urgência não realizada |

Fonte: WHO (2013).

---

**Tabela 6.8** — Variáveis calculadas automaticamente pelo sistema para o índice CPOD e indicadores complementares.

| Variável interna | Coluna no BD | Códigos de origem | Descrição |
|-----------------|-------------|-------------------|-----------|
| `cCount` | `c_total` | Código 1 | Contagem de dentes cariados |
| `pCount` | `p_total` | Código 4 (sempre); Código 5 (se idade ≥ 30) | Contagem de dentes perdidos |
| `oCount` | `o_total` | Códigos 2 e 3 | Contagem de dentes obturados/restaurados |
| `cpodTotal` | `cpod_total` | C + P + O | Índice CPOD total |
| `sCount` | `s_total` | Código 6 | Contagem de selantes (informativo) |
| `prCount` | `pr_total` | Código 7 | Contagem de coroas/pontes/implantes (informativo) |

Fonte: Elaborado pelos autores com base em Klein, Palmer e Knutson (1938) e implementado em `src/App.tsx` (2026).

---

## 7. FLUXOGRAMA DE FUNCIONAMENTO

### [FIGURA 7.1]

> **Como capturar:** Esta figura é um fluxograma — não é uma captura do aplicativo. Reproduzir com ferramenta de diagramas (Lucidchart, Draw.io, Microsoft Visio ou equivalente) usando o modelo abaixo.

```
┌─────────────────────────────────────────────────────────────────┐
│  FLUXOGRAMA — FIGURA 7.1                                        │
│  (Reproduzir como figura vetorial em ferramenta de diagramas)   │
│                                                                 │
│  INÍCIO                                                         │
│     │                                                           │
│     ▼                                                           │
│  [1] Identificação                                              │
│  ID · Idade · Sexo · Escola · Examinador · Data                 │
│     │                                                           │
│     ▼                                                           │
│  [2] IHOS — 6 dentes índice (escores 0–3 ou 9)                  │
│  Sistema calcula média automaticamente                          │
│     │                                                           │
│     ▼                                                           │
│  [3] Condição da Coroa — 32 dentes (códigos 0–9)                │
│  Sistema calcula CPOD automaticamente                           │
│     │                                                           │
│     ▼                                                           │
│  [4] Uso de Prótese — Superior e Inferior                       │
│     │                                                           │
│     ▼                                                           │
│  [5] Necessidade de Prótese — Superior e Inferior               │
│     │                                                           │
│     ▼                                                           │
│  [6] Urgência de Tratamento                                     │
│     │                                                           │
│     ▼                                                           │
│  [7] Revisar Resumo                                             │
│     │                                                           │
│     ▼                                                           │
│  SALVAR EXAME → Validação frontend → [FALHOU?] → Exibe erros    │
│     │ OK                                                        │
│     ▼                                                           │
│  POST /save-clinical-exam → Validação backend                   │
│     │ OK                                                        │
│     ▼                                                           │
│  INSERT exams + tooth_records                                   │
│     │                                                           │
│     ▼                                                           │
│  Notificação de sucesso → Formulário limpo → PRÓXIMO EXAME      │
└─────────────────────────────────────────────────────────────────┘
```

**Figura 7.1** — Fluxograma completo do processo de coleta de dados no EpiBucal. O fluxo percorre sequencialmente sete seções, com validação em duas etapas (frontend e backend) antes da persistência dos dados. Em caso de erro de validação, o sistema exibe a mensagem correspondente e mantém os dados preenchidos para correção pelo examinador. Fonte: Elaborado pelos autores (2026).

---

## 8. DESCRIÇÃO DE CADA TELA

### 8.1 Cabeçalho com Indicadores em Tempo Real

### [FIGURA 8.1 — já descrita como Figura 1.2]

*Ver Figura 1.2 — Cabeçalho com indicadores CPOD e IHOS em tempo real.*

---

### 8.2 Seção 1 — Identificação do Participante

### [FIGURA 8.1]

> **Como capturar:** Role até a seção "Identificação" e capture-a inteira, com todos os campos visíveis. Preencha os campos com dados fictícios de exemplo para ilustração.

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPTURA DE TELA — FIGURA 8.1                                   │
│                                                                 │
│  O QUE CAPTURAR:                                                │
│  • Seção completa "Identificação"                               │
│  • Campo ID: "P042"                                             │
│  • Campo Idade: "12"                                            │
│  • Seletor Sexo: "Masculino" marcado                            │
│  • Campo Escola: "EM Monteiro Lobato"                           │
│  • Campo Examinador: "Dr. João Silva"                           │
│  • Campo Data: "01/06/2026"                                     │
│  • Todos os campos preenchidos (não deixar em branco)           │
│                                                                 │
│  DISPOSITIVO: Desktop ou tablet landscape                       │
└─────────────────────────────────────────────────────────────────┘
```

**Figura 8.1** — Seção de Identificação do Participante do EpiBucal, exibindo os seis campos de preenchimento obrigatório: código do participante, idade, sexo, escola/local de coleta, nome do examinador e data da coleta. Os campos marcados com asterisco (*) são de preenchimento obrigatório e são validados antes do salvamento. Fonte: Elaborado pelos autores (2026).

---

### 8.3 Seção 2 — IHOS

### [FIGURA 8.2]

> **Como capturar:** Role até a seção "IHOS". Selecione escores diferentes para cada dente (ex.: 16=1, 11=0, 26=2, 31=1, 36=9, 46=2). Capture a grade completa dos 6 dentes com os botões de seleção visíveis.

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPTURA DE TELA — FIGURA 8.2                                   │
│                                                                 │
│  O QUE CAPTURAR:                                                │
│  • Grade com 6 cartões de dentes índice                         │
│  • Cada cartão mostrando: número do dente + 5 botões (0,1,2,3,9)│
│  • Botões com cores diferentes conforme o escore selecionado:   │
│    0=verde, 1=amarelo, 2=laranja, 3=vermelho, 9=branco          │
│  • Estado sugerido:                                             │
│    Dente 16 = 1 (botão amarelo ativo)                           │
│    Dente 11 = 0 (botão verde ativo)                             │
│    Dente 26 = 2 (botão laranja ativo)                           │
│    Dente 31 = 1 (botão amarelo ativo)                           │
│    Dente 36 = 9 (botão branco ativo)                            │
│    Dente 46 = 2 (botão laranja ativo)                           │
└─────────────────────────────────────────────────────────────────┘
```

**Figura 8.2** — Seção IHOS do EpiBucal exibindo a grade dos seis dentes índice (16, 11, 26, 31, 36 e 46) com seus respectivos botões de seleção de escore (0 a 3 e 9). A codificação cromática dos botões facilita a identificação visual dos escores: verde (0 = sem placa), amarelo (1 = até 1/3), laranja (2 = 1/3 a 2/3), vermelho (3 = mais de 2/3) e branco (9 = não registrado). Fonte: Elaborado pelos autores (2026).

---

### [FIGURA 8.3]

> **Como capturar:** Com o mesmo estado da Figura 8.2, capture apenas o painel de resultado do IHOS, que exibe o valor calculado, a barra colorida e a classificação. O valor esperado com os escores sugeridos é IHOS = 1,20 → Classificação: Boa.

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPTURA DE TELA — FIGURA 8.3                                   │
│                                                                 │
│  O QUE CAPTURAR:                                                │
│  • Painel "IHOS Total" na parte inferior da seção IHOS          │
│  • Valor numérico com 2 casas decimais (ex.: "1.20")            │
│  • Barra de progresso colorida (verde neste exemplo)            │
│  • Badge de classificação: "Classificação: Boa" em verde        │
│  • Legenda "0 - Sem placa" e "3 - Placa extensa" visíveis       │
│                                                                 │
│  VARIAÇÃO: fazer 3 capturas para mostrar as 3 classificações:   │
│  • Boa (verde): escores baixos → IHOS ≤ 1,2                     │
│  • Regular (amarelo): escores médios → IHOS entre 1,3 e 2,0     │
│  • Necessita Melhoria (vermelho): escores altos → IHOS > 2,0    │
└─────────────────────────────────────────────────────────────────┘
```

**Figura 8.3** — Painel de resultado do Índice de Higiene Oral Simplificado (IHOS) exibindo o valor calculado automaticamente, a barra de progresso com coloração dinâmica e a classificação textual. O sistema exclui automaticamente os escores 9 (não registrados) do cálculo da média, permitindo o registro mesmo quando algum dente índice está ausente. Fonte: Elaborado pelos autores (2026).

---

### 8.4 Seção 3 — Condição da Coroa

### [FIGURA 8.4]

> **Como capturar:** Role até a seção "Condição da Coroa". Expanda a arcada superior. Selecione códigos diferentes para vários dentes para demonstrar a codificação cromática. Capture toda a arcada superior.

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPTURA DE TELA — FIGURA 8.4                                   │
│                                                                 │
│  O QUE CAPTURAR:                                                │
│  • Arcada superior expandida (dentes 18 a 28)                   │
│  • Cada dente com seu número FDI e os 10 botões de código       │
│  • Estado sugerido para demonstração de cores:                  │
│    Dente 18 = 9 (branco - não registrado)                       │
│    Dente 17 = 0 (verde claro - hígido)                          │
│    Dente 16 = 3 (teal - restaurado)                             │
│    Dente 15 = 1 (vermelho - cariado)                            │
│    Dente 14 = 4 (cinza - perdido)                               │
│    Dente 13 = 6 (azul - selante)                                │
│    Demais = 0 (hígidos)                                         │
│  • Painel lateral com C, P, O, CPOD visíveis                    │
└─────────────────────────────────────────────────────────────────┘
```

**Figura 8.4** — Seção Condição da Coroa do EpiBucal com a arcada superior expandida (dentes 18 a 28), demonstrando a codificação cromática dos dez códigos de condição dentária. Cada dente exibe seu número FDI e um conjunto de botões coloridos correspondentes aos códigos 0 a 9. O sistema calcula e exibe o índice CPOD em tempo real no painel lateral conforme os códigos são selecionados. Fonte: Elaborado pelos autores (2026).

---

### [FIGURA 8.5]

> **Como capturar:** Mesmo estado que a Figura 8.4, mas com a arcada inferior expandida. Capture a arcada inferior com alguns dentes selecionados.

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPTURA DE TELA — FIGURA 8.5                                   │
│                                                                 │
│  O QUE CAPTURAR:                                                │
│  • Arcada inferior expandida (dentes 48 a 31)                   │
│  • Pelo menos 4 dentes com códigos diferentes                   │
│  • Demonstração de que ambas as arcadas podem estar             │
│    expandidas simultaneamente                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Figura 8.5** — Seção Condição da Coroa com a arcada inferior expandida (dentes 48 a 31). O sistema permite a expansão simultânea das arcadas superior e inferior, facilitando a navegação durante o exame clínico. A ordem dos dentes segue a disposição anatômica, com os molares nas extremidades e os incisivos centrais no centro da grade. Fonte: Elaborado pelos autores (2026).

---

### [FIGURA 8.6]

> **Como capturar:** Com vários dentes preenchidos nas duas arcadas, capture o painel de resumo do CPOD que fica visível ao lado ou abaixo das arcadas, mostrando os cartões C, P, O e CPOD Total.

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPTURA DE TELA — FIGURA 8.6                                   │
│                                                                 │
│  O QUE CAPTURAR:                                                │
│  • Painel lateral/inferior com os 4 cartões:                    │
│    C = 2 (número de cariados)                                   │
│    P = 1 (número de perdidos)                                   │
│    O = 3 (número de obturados)                                  │
│    CPOD = 6 (total)                                             │
│  • Cartão CPOD com fonte maior em destaque                      │
│  • Fundo de cada cartão visível                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Figura 8.6** — Painel de cálculo do índice CPOD em tempo real, exibindo os componentes C (cariados), P (perdidos) e O (obturados) em cartões individuais, além do total CPOD calculado automaticamente. Os valores são atualizados instantaneamente a cada seleção de código dentário, sem necessidade de confirmação do examinador. Fonte: Elaborado pelos autores (2026).

---

### 8.5 Seção 4 — Uso de Prótese

### [FIGURA 8.7]

> **Como capturar:** Role até a seção "Uso de Prótese". Selecione opções diferentes para superior e inferior para demonstrar a interface. Capture toda a seção.

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPTURA DE TELA — FIGURA 8.7                                   │
│                                                                 │
│  O QUE CAPTURAR:                                                │
│  • Seção completa "Uso de Prótese"                              │
│  • Grupo "Arcada Superior" com opção selecionada                │
│  • Grupo "Arcada Inferior" com opção diferente selecionada      │
│  • Estado sugerido:                                             │
│    Superior = 0 (Sem prótese) — botão verde selecionado         │
│    Inferior = 1 (Prótese parcial) — botão âmbar selecionado     │
│  • Cores dos botões visíveis                                    │
└─────────────────────────────────────────────────────────────────┘
```

**Figura 8.7** — Seção de Uso de Prótese do EpiBucal, exibindo os grupos de seleção para as arcadas superior e inferior. O sistema oferece quatro opções para cada arcada (sem prótese, parcial, total e não registrado), com codificação cromática consistente: verde para ausência de prótese, tons de âmbar/laranja para próteses presentes e branco para não registrado. Fonte: Elaborado pelos autores (2026).

---

### 8.6 Seção 5 — Necessidade de Prótese

### [FIGURA 8.8]

> **Como capturar:** Role até "Necessidade de Prótese". Selecione opções diferentes para as duas arcadas e capture a seção completa.

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPTURA DE TELA — FIGURA 8.8                                   │
│                                                                 │
│  O QUE CAPTURAR:                                                │
│  • Seção completa "Necessidade de Prótese"                      │
│  • 5 botões por arcada (0, 1, 2, 3, 9)                          │
│  • Estado sugerido:                                             │
│    Superior = 0 (Sem necessidade) — botão verde                 │
│    Inferior = 2 (Mais de 1 elemento) — botão laranja            │
└─────────────────────────────────────────────────────────────────┘
```

**Figura 8.8** — Seção de Necessidade de Prótese do EpiBucal. Para cada arcada, o examinador seleciona entre cinco opções que avaliam a extensão da necessidade reabilitadora protética, seguindo os critérios da OMS (2013). A codificação de cores utiliza gradiente verde-âmbar-laranja-vermelho para indicar crescente complexidade de tratamento necessário. Fonte: Elaborado pelos autores (2026).

---

### 8.7 Seção 6 — Urgência de Tratamento

### [FIGURA 8.9]

> **Como capturar:** Role até "Urgência de Tratamento". Selecione a opção "2 — Eletivo" para demonstração. Capture a seção completa mostrando todos os 5 botões.

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPTURA DE TELA — FIGURA 8.9                                   │
│                                                                 │
│  O QUE CAPTURAR:                                                │
│  • Seção "Urgência de Tratamento" completa                      │
│  • 5 botões em linha ou grade:                                  │
│    0=Sem necessidade (verde)                                    │
│    1=Preventivo (azul)                                          │
│    2=Eletivo (âmbar) ← selecionado                              │
│    3=Urgente (vermelho)                                         │
│    9=Não registrado (branco)                                    │
│  • Botão "2 Eletivo" com destaque de seleção ativo              │
└─────────────────────────────────────────────────────────────────┘
```

**Figura 8.9** — Seção de Urgência de Tratamento do EpiBucal, exibindo as cinco categorias de necessidade de tratamento com codificação cromática intuitiva. A opção "3 — Urgente" (vermelho) sinaliza ao pesquisador a necessidade de encaminhamento imediato do participante para atenção odontológica. Fonte: Elaborado pelos autores (2026).

---

### 8.8 Seção 7 — Resumo

### [FIGURA 8.10]

> **Como capturar:** Com o formulário completamente preenchido (todas as seções), role até a seção "Resumo". Capture o painel completo de resumo.

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPTURA DE TELA — FIGURA 8.10                                  │
│                                                                 │
│  O QUE CAPTURAR:                                                │
│  • Seção "Resumo" completa                                      │
│  • Bloco CPOD: C=2, P=1, O=3, CPOD=6 visíveis                  │
│  • Bloco IHOS: valor decimal + barra colorida + classificação   │
│  • Grade de distribuição das condições:                         │
│    Hígido / Cariado / Restaurado / Perdido / Selante / Prótese  │
│  • Todos os cartões com valores preenchidos (não zeros)         │
│                                                                 │
│  ESTADO DO FORMULÁRIO: preencher ao menos 10 dentes             │
│  com códigos variados antes de capturar                         │
└─────────────────────────────────────────────────────────────────┘
```

**Figura 8.10** — Seção de Resumo do EpiBucal exibindo o painel consolidado de todos os indicadores do exame: componentes C, P, O e total do CPOD; resultado e classificação do IHOS; e distribuição das seis categorias de condição dentária. Esta seção permite ao examinador revisar e confirmar todos os dados antes do salvamento definitivo. Fonte: Elaborado pelos autores (2026).

---

### [FIGURA 8.11]

> **Como capturar:** Com o formulário completo, capture a área dos botões de ação (Salvar Exame, Exportar CSV, Limpar, Excluir Exames Salvos).

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPTURA DE TELA — FIGURA 8.11                                  │
│                                                                 │
│  O QUE CAPTURAR:                                                │
│  • Área dos 4 botões de ação                                    │
│  • "Salvar Exame" (azul/teal)                                   │
│  • "Exportar CSV" (verde)                                       │
│  • "Limpar" (cinza)                                             │
│  • "Excluir Exames Salvos" (vermelho)                           │
│  • Botões sem estado de carregamento (estado normal)            │
└─────────────────────────────────────────────────────────────────┘
```

**Figura 8.11** — Botões de ação do EpiBucal localizados na seção de Resumo. Da esquerda para a direita: "Salvar Exame" persiste os dados no banco de dados via Edge Function; "Exportar CSV" baixa todos os exames registrados em formato tabulado; "Limpar" reinicia o formulário para o próximo participante; "Excluir Exames Salvos" remove permanentemente todos os registros (com confirmação obrigatória). Fonte: Elaborado pelos autores (2026).

---

### [FIGURA 8.12]

> **Como capturar:** Clique no botão "Excluir Exames Salvos". O modal de confirmação aparecerá. Capture o modal aberto sobre o formulário.

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPTURA DE TELA — FIGURA 8.12                                  │
│                                                                 │
│  O QUE CAPTURAR:                                                │
│  • Modal de confirmação centralizado na tela                    │
│  • Fundo escurecido (overlay) sobre o formulário                │
│  • Texto de aviso sobre a irreversibilidade da ação             │
│  • Botão "Confirmar" (vermelho)                                 │
│  • Botão "Cancelar" (cinza)                                     │
└─────────────────────────────────────────────────────────────────┘
```

**Figura 8.12** — Modal de confirmação de exclusão de todos os exames salvos no EpiBucal. O sistema exige confirmação explícita do usuário antes de executar a operação irreversível de exclusão em massa, protegendo contra exclusões acidentais durante sessões de coleta de dados. Fonte: Elaborado pelos autores (2026).

---

## 9. REGRAS DE NEGÓCIO

### [FIGURA 9.1]

> **Como capturar:** Tente salvar o formulário sem preencher os campos obrigatórios. A notificação de erro aparecerá no topo. Capture o formulário com a notificação visível.

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPTURA DE TELA — FIGURA 9.1                                   │
│                                                                 │
│  O QUE CAPTURAR:                                                │
│  • Notificação de erro no topo da tela (fundo vermelho/âmbar)   │
│  • Mensagem de validação legível (ex.: "Informe o ID do         │
│    participante" ou "Informe uma idade válida")                 │
│  • Formulário ao fundo com campos em branco                     │
└─────────────────────────────────────────────────────────────────┘
```

**Figura 9.1** — Notificação de erro de validação do EpiBucal exibida quando o examinador tenta salvar o exame sem preencher todos os campos obrigatórios. O sistema valida os dados no frontend antes de qualquer comunicação com o servidor, fornecendo feedback imediato e específico sobre o campo que requer atenção. Fonte: Elaborado pelos autores (2026).

---

### [FIGURA 9.2]

> **Como capturar:** Preencha todos os campos obrigatórios corretamente e clique em "Salvar Exame". Capture a notificação de sucesso verde que aparece no topo.

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPTURA DE TELA — FIGURA 9.2                                   │
│                                                                 │
│  O QUE CAPTURAR:                                                │
│  • Notificação de sucesso no topo (fundo verde)                 │
│  • Mensagem de confirmação visível (ex.: "Exame salvo com       │
│    sucesso!" ou similar)                                        │
│  • Formulário ao fundo já limpo (pronto para novo exame)        │
└─────────────────────────────────────────────────────────────────┘
```

**Figura 9.2** — Notificação de sucesso do EpiBucal exibida após o salvamento bem-sucedido de um exame clínico. Após a confirmação pelo servidor, o sistema limpa automaticamente o formulário e reinicia todos os campos para os valores padrão, preparando a interface para o registro do próximo participante. Fonte: Elaborado pelos autores (2026).

---

**Tabela 9.1** — Regras de validação do frontend implementadas na função `validateForm()` do arquivo `src/App.tsx`.

| Campo | Regra de validação | Mensagem exibida ao usuário |
|-------|-------------------|-----------------------------|
| ID do participante | `participantId.trim()` não vazio | "Informe o ID do participante" |
| Idade | Inteiro válido entre 0 e 150 | "Informe uma idade válida (0-150)" |
| Sexo | Deve ser "M" ou "F" | "Selecione o sexo" |
| Examinador | `examiner.trim()` não vazio | "Informe o nome do examinador" |
| Data da coleta | Campo não vazio | "Informe a data de coleta" |

Fonte: Elaborado pelos autores com base em `src/App.tsx` (2026).

---

**Tabela 9.2** — Regras de validação do backend implementadas na Edge Function `save-clinical-exam`, executadas no servidor após o envio do formulário.

| Campo | Tipo esperado | Regra | Código de erro |
|-------|--------------|-------|----------------|
| `participante` | string | Não vazio após trim | 422 |
| `idade` | integer | Entre 0 e 120 | 422 |
| `sexo` | string | Valores aceitos: M, F, masculino, feminino (case-insensitive) | 422 |
| `escola` | string | Não vazio após trim | 422 |
| `examinador` | string | Não vazio após trim | 422 |
| `data_coleta` | date | Data válida (parseável por Date.parse()) | 422 |
| `uso_protese_*` | integer | Valor em [0,1,2,3,4,5,9] | 422 |
| `urgencia_tratamento` | integer | Valor em [0,1,2,9] | 422 |
| `c_total`, `p_total`, `o_total`, `cpod_total` | integer | Não negativos | 422 |
| `dentes` | array | Não vazio | 422 |
| Cada dente: `numero_dente` | integer | Número FDI válido (11–48) | 422 |
| Cada dente: `codigo_coroa` | integer | Valor em [0–9] | 422 |

Fonte: Elaborado pelos autores com base em `supabase/functions/save-clinical-exam/index.ts` (2026).

---

## 10. CÁLCULO DETALHADO DO CPOD

### [FIGURA 10.1]

> **Como capturar:** Com o formulário preenchido mostrando C=2, P=1, O=3, CPOD=6 (ou valores similares), capture o painel de resumo do CPOD.

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPTURA DE TELA — FIGURA 10.1                                  │
│                                                                 │
│  O QUE CAPTURAR:                                                │
│  • Painel com os 4 cartões: C / P / O / CPOD Total              │
│  • Valores numéricos visíveis em cada cartão                    │
│  • Cartão CPOD com destaque visual (maior ou em negrito)        │
│  • Idealmente mostrar: C=2, P=1, O=3, CPOD=6                    │
│                                                                 │
│  ESTADO DO FORMULÁRIO:                                          │
│  • 2 dentes com código 1 (ex.: 14 e 25)                         │
│  • 1 dente com código 4 (ex.: 36)                               │
│  • 2 dentes com código 3 + 1 dente com código 2 (ex.: 16,11,26) │
│  • Participante: idade = 25 anos (para não incluir código 5)    │
└─────────────────────────────────────────────────────────────────┘
```

**Figura 10.1** — Painel de cálculo automático do índice CPOD exibindo os três componentes individuais (C = cariados, P = perdidos, O = obturados) e o total do índice. O sistema recalcula os valores em tempo real a cada seleção de código dentário, permitindo ao examinador verificar a progressão do índice durante o exame. Fonte: Elaborado pelos autores (2026).

---

## 11. CÁLCULO DETALHADO DO IHOS

### [FIGURA 11.1]

> **Como capturar:** Configure os 6 dentes IHOS com escores baixos (todos 0 ou 1) para obter IHOS ≤ 1,2. Capture o painel de resultado mostrando a classificação "Boa" com barra verde.

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPTURA DE TELA — FIGURA 11.1                                  │
│                                                                 │
│  ESCORES PARA ESTA CAPTURA:                                     │
│  Dente 16 = 0, 11 = 1, 26 = 0, 31 = 1, 36 = 0, 46 = 1          │
│  IHOS calculado = (0+1+0+1+0+1)/6 = 0,50                       │
│                                                                 │
│  O QUE CAPTURAR:                                                │
│  • Painel "IHOS Total" mostrando "0.50"                         │
│  • Barra de progresso VERDE (pequena, ~17% do total)            │
│  • Badge verde: "Classificação: Boa"                            │
└─────────────────────────────────────────────────────────────────┘
```

**Figura 11.1** — Painel de resultado do IHOS exibindo classificação "Boa" (verde) para valor ≤ 1,2. Esta faixa indica higiene oral adequada, com placa bacteriana ausente ou restrita ao terço cervical das superfícies dentárias examinadas. Fonte: Elaborado pelos autores (2026).

---

### [FIGURA 11.2]

> **Como capturar:** Configure os dentes IHOS com escores médios para obter IHOS entre 1,3 e 2,0. Capture o painel com barra amarela e classificação "Regular".

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPTURA DE TELA — FIGURA 11.2                                  │
│                                                                 │
│  ESCORES PARA ESTA CAPTURA:                                     │
│  Dente 16 = 2, 11 = 1, 26 = 2, 31 = 1, 36 = 2, 46 = 1          │
│  IHOS calculado = (2+1+2+1+2+1)/6 = 1,50                       │
│                                                                 │
│  O QUE CAPTURAR:                                                │
│  • Painel "IHOS Total" mostrando "1.50"                         │
│  • Barra de progresso AMARELA (~50% do total)                   │
│  • Badge amarelo: "Classificação: Regular"                      │
└─────────────────────────────────────────────────────────────────┘
```

**Figura 11.2** — Painel de resultado do IHOS exibindo classificação "Regular" (amarelo) para valor entre 1,3 e 2,0. Esta faixa indica higiene oral parcialmente comprometida, com placa bacteriana cobrindo entre um e dois terços das superfícies avaliadas, requerendo intervenção de orientação e motivação em higiene oral. Fonte: Elaborado pelos autores (2026).

---

### [FIGURA 11.3]

> **Como capturar:** Configure os dentes IHOS com escores altos (2 e 3) para obter IHOS > 2,0. Capture o painel com barra vermelha e classificação "Necessita Melhoria".

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPTURA DE TELA — FIGURA 11.3                                  │
│                                                                 │
│  ESCORES PARA ESTA CAPTURA:                                     │
│  Dente 16 = 3, 11 = 2, 26 = 3, 31 = 2, 36 = 3, 46 = 2          │
│  IHOS calculado = (3+2+3+2+3+2)/6 = 2,50                       │
│                                                                 │
│  O QUE CAPTURAR:                                                │
│  • Painel "IHOS Total" mostrando "2.50"                         │
│  • Barra de progresso VERMELHA (~83% do total)                  │
│  • Badge vermelho: "Classificação: Necessita Melhoria"          │
└─────────────────────────────────────────────────────────────────┘
```

**Figura 11.3** — Painel de resultado do IHOS exibindo classificação "Necessita Melhoria" (vermelho) para valor entre 2,1 e 3,0. Esta faixa indica higiene oral deficiente, com placa bacteriana cobrindo mais de dois terços das superfícies avaliadas, demandando intervenção educativa intensiva e acompanhamento periódico. Fonte: Elaborado pelos autores (2026).

---

## 12. USO E NECESSIDADE DE PRÓTESE

*Ver Figura 8.7 (Seção 4 — Uso de Prótese) e Figura 8.8 (Seção 5 — Necessidade de Prótese).*

O registro de prótese é realizado de forma independente para cada arcada (superior e inferior), permitindo situações assiméttricas como: paciente edêntulo superior total (código 2) com presença de todos os dentes inferiores (código 0).

---

## 13. NECESSIDADE DE TRATAMENTO

*Ver Figura 8.9 (Seção 6 — Urgência de Tratamento).*

A urgência de tratamento é registrada como avaliação global do participante, não por dente. Um participante classificado como código 3 (Urgente) deve ser preferencialmente encaminhado para atenção odontológica imediata, independentemente do contexto do levantamento epidemiológico.

---

## 14. ESTRUTURA DE EXPORTAÇÃO CSV

### [FIGURA 14.1]

> **Como capturar:** Esta figura exige que haja pelo menos 3 exames salvos no banco. Clique em "Exportar CSV", abra o arquivo no Microsoft Excel e capture a planilha mostrando as primeiras 10 linhas com os cabeçalhos visíveis.

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPTURA DE TELA — FIGURA 14.1                                  │
│                                                                 │
│  PRÉ-REQUISITO: Ter ao menos 3 exames salvos no banco           │
│                                                                 │
│  PASSOS:                                                        │
│  1. Clique em "Exportar CSV"                                    │
│  2. Abra o arquivo no Excel (Dados > De Texto/CSV,              │
│     delimitador ponto e vírgula, UTF-8)                         │
│  3. Role até ver as colunas A a Z e além                        │
│                                                                 │
│  O QUE CAPTURAR:                                                │
│  • Linha 1: cabeçalhos (participante, idade, sexo...)           │
│  • Linhas 2-4: dados dos exames                                 │
│  • Colunas A até pelo menos AB visíveis                         │
│  • Linha de título da janela do Excel visível                   │
│  • Nome do arquivo na barra de título do Excel                  │
│                                                                 │
│  ALTERNATIVA: usar LibreOffice Calc se não tiver Excel          │
└─────────────────────────────────────────────────────────────────┘
```

**Figura 14.1** — Arquivo CSV exportado pelo EpiBucal aberto no Microsoft Excel, exibindo as 56 colunas de dados epidemiológicos organizadas por exame (linhas). O arquivo utiliza ponto e vírgula como delimitador e codificação UTF-8, sendo compatível com os principais softwares de análise estatística utilizados em pesquisas de saúde bucal (SPSS, R, Stata, SAS). Fonte: Elaborado pelos autores (2026).

---

**Tabela 14.1** — Estrutura completa do arquivo CSV exportado pelo EpiBucal, contendo 56 colunas organizadas em seis grupos temáticos.

| Grupo | Colunas | # colunas | Descrição |
|-------|---------|-----------|-----------|
| Identificação | participante, idade, sexo, escola, examinador, data_coleta | 6 | Dados do participante e contexto do exame |
| IHOS | ihos_16, ihos_11, ihos_26, ihos_31, ihos_36, ihos_46, ihos_total | 7 | Escores individuais e média do IHOS |
| Dentes superiores | d18, d17, d16, d15, d14, d13, d12, d11, d21, d22, d23, d24, d25, d26, d27, d28 | 16 | Códigos de condição — arcada superior |
| Dentes inferiores | d48, d47, d46, d45, d44, d43, d42, d41, d31, d32, d33, d34, d35, d36, d37, d38 | 16 | Códigos de condição — arcada inferior |
| Prótese e urgência | uso_protese_superior, uso_protese_inferior, necessidade_protese_superior, necessidade_protese_inferior, urgencia_tratamento | 5 | Avaliação protética e necessidade de tratamento |
| Indicadores calculados | c_total, p_total, o_total, cpod_total, s_total, pr_total | 6 | CPOD e variáveis complementares |
| **Total** | | **56** | |

Fonte: Elaborado pelos autores com base no código de exportação em `src/App.tsx` (2026).

---

## 15. VALIDAÇÃO DOS INDICADORES

**Tabela 15.1** — Indicadores de qualidade e consistência dos dados exportados pelo EpiBucal, recomendados para verificação pós-coleta.

| Verificação | Regra esperada | Ação em caso de inconsistência |
|-------------|---------------|-------------------------------|
| Códigos de condição dentária | Valores entre 0 e 9 em todas as colunas d11–d48 | Revisar o registro do participante |
| Escores IHOS individuais | Valores 0, 1, 2, 3 ou 9 em ihos_16 a ihos_46 | Revisar o registro |
| CPOD total | `c_total + p_total + o_total = cpod_total` | Dado corrompido — excluir da análise |
| CPOD máximo | `cpod_total ≤ 32` | Verificar registro — valor impossível |
| Consistência do IHOS | `ihos_total` coerente com média dos escores individuais | Recalcular manualmente |
| Regra de idade (código 5) | Participante < 30 anos não deve ter código 5 no `p_total` | Verificar idade registrada |
| Faixa etária | `0 ≤ idade ≤ 150` | Verificar campo de identificação |
| Sexo | Valores "M" ou "F" apenas | Corrigir no banco |
| Edentulismo total | Todos os 32 dentes com código 4 ou 5 | Verificar uso de prótese total registrado |

Fonte: Elaborado pelos autores (2026).

---

## 16. LIMITAÇÕES ATUAIS DO SISTEMA

**Tabela 16.1** — Limitações identificadas na versão 1.0 do EpiBucal, com impacto e prioridade de resolução.

| # | Limitação | Impacto na pesquisa | Prioridade |
|---|-----------|---------------------|------------|
| 1 | Sem autenticação de usuários | Qualquer pessoa com a URL pode acessar e modificar dados | Alta |
| 2 | Sem controle de duplicatas de participantes | Risco de múltiplos registros para o mesmo indivíduo | Alta |
| 3 | RLS permissiva (acesso anônimo) | Dados visíveis para qualquer usuário anônimo da plataforma | Alta |
| 4 | Sem suporte a dentição decídua (ceod/CEOD) | Impossibilita uso em crianças abaixo de 6 anos | Média |
| 5 | Sem modo offline | Impossibilidade de coleta sem conexão com internet | Média |
| 6 | Sem exportação XLSX nativa | Exige conversão manual do CSV pelo pesquisador | Baixa |
| 7 | Painel administrativo desabilitado | Monitoramento de uso e auditoria de acesso indisponíveis | Baixa |
| 8 | Sem versionamento de formulário | Alterações no formulário afetam a interpretação histórica | Média |
| 9 | Sem campo de observações clínicas por dente | Impossibilidade de registro de notas específicas | Baixa |
| 10 | Sem geração de laudo individual | O sistema não produz relatório por participante | Média |

Fonte: Elaborado pelos autores (2026).

---

## 17. MELHORIAS FUTURAS

**Tabela 17.1** — Melhorias planejadas para versões futuras do EpiBucal, com benefício esperado e complexidade de implementação estimada.

| # | Melhoria proposta | Benefício para a pesquisa | Complexidade |
|---|------------------|--------------------------|-------------|
| 1 | Autenticação por examinador (login) | Rastreabilidade completa e controle de acesso | Média |
| 2 | Suporte a dentição decídua (ceod/CEOD) | Abrangência para crianças de 0 a 5 anos | Alta |
| 3 | Modo offline com sincronização | Coleta em áreas sem conectividade | Alta |
| 4 | Geração de laudo PDF por participante | Uso clínico direto e devolução de resultados | Média |
| 5 | Dashboard epidemiológico em tempo real | Monitoramento do estudo durante a coleta | Alta |
| 6 | Exportação para SPSS/R (.sav, .rds) | Eliminação da etapa de conversão | Baixa |
| 7 | Suporte multilíngue (PT/EN/ES) | Viabiliza uso em pesquisas internacionais | Média |
| 8 | Módulo de calibração de examinadores | Controle de qualidade e concordância interexaminadores | Alta |
| 9 | Histórico de edições com auditoria (LGPD) | Conformidade com a legislação brasileira de proteção de dados | Média |
| 10 | Integração com RNDS/SISAB | Interoperabilidade com sistemas nacionais de saúde | Muito alta |
| 11 | Questionário socioeconômico integrado | Dados contextuais para análise multivariada | Baixa |
| 12 | Randomização automática de participantes | Suporte a estudos com seleção amostral probabilística | Média |

Fonte: Elaborado pelos autores (2026).

---

## 18. MANUAL OPERACIONAL PARA EXAMINADORES

### [FIGURA 18.1]

> **Como capturar:** Esta figura é um diagrama de fluxo simplificado do processo operacional — não é uma captura de tela. Reproduzir com ferramenta de diagramas ou criar como infográfico.

```
┌─────────────────────────────────────────────────────────────────┐
│  DIAGRAMA OPERACIONAL — FIGURA 18.1                             │
│  (Reproduzir como infográfico ou fluxo simplificado)            │
│                                                                 │
│  [1] ABRIR O APLICATIVO NO NAVEGADOR                            │
│       ↓                                                         │
│  [2] VERIFICAR A DATA DA COLETA                                 │
│       ↓                                                         │
│  [3] PREENCHER IDENTIFICAÇÃO DO PARTICIPANTE                    │
│       ↓                                                         │
│  [4] REGISTRAR IHOS (6 dentes) → sistema calcula                │
│       ↓                                                         │
│  [5] REGISTRAR CONDIÇÃO DA COROA (32 dentes) → sistema calcula  │
│       ↓                                                         │
│  [6] REGISTRAR USO E NECESSIDADE DE PRÓTESE                     │
│       ↓                                                         │
│  [7] REGISTRAR URGÊNCIA DE TRATAMENTO                           │
│       ↓                                                         │
│  [8] REVISAR RESUMO                                             │
│       ↓                                                         │
│  [9] CLICAR "SALVAR EXAME" → aguardar confirmação               │
│       ↓                                                         │
│  [10] PRÓXIMO PARTICIPANTE (formulário limpo automaticamente)   │
└─────────────────────────────────────────────────────────────────┘
```

**Figura 18.1** — Fluxo operacional simplificado para examinadores do EpiBucal. Os dez passos representam a sequência recomendada de preenchimento durante o exame clínico. O sistema calcula automaticamente os índices CPOD e IHOS após cada seleção (passos 4 e 5), eliminando o risco de erros de cálculo manual. Fonte: Elaborado pelos autores (2026).

---

**Tabela 18.1** — Erros comuns durante o uso do EpiBucal em campo, com causas identificadas e soluções recomendadas.

| Mensagem ou situação | Causa mais provável | Solução |
|---------------------|--------------------|---------| 
| "Informe o ID do participante" | Campo participante em branco | Preencher o campo antes de salvar |
| "Informe uma idade válida" | Idade fora do intervalo 0–150 ou não preenchida | Corrigir o valor da idade |
| "Selecione o sexo" | Nenhuma opção de sexo selecionada | Selecionar M ou F |
| "Informe o nome do examinador" | Campo examinador em branco | Preencher o campo |
| "Erro ao salvar" (genérico) | Falha de conexão com a internet | Verificar conectividade e tentar novamente |
| CPOD mostrando 0 com dentes preenchidos | Dentes registrados com código 0 (hígido) | Comportamento correto — verificar os códigos selecionados |
| IHOS mostrando "--" | Todos os 6 dentes com escore 9 | Registrar ao menos 1 escore válido (0–3) |
| Formulário travado | Página descarregada do navegador | Recarregar a página (F5) — dados não salvos serão perdidos |
| Exportação CSV vazia | Nenhum exame salvo no banco | Salvar ao menos 1 exame antes de exportar |

Fonte: Elaborado pelos autores (2026).

---

## 19. MANUAL DE EXPORTAÇÃO DOS DADOS

### 19.1 Exportando o Arquivo CSV

1. Na seção **Resumo**, clique no botão **"Exportar CSV"** (verde)
2. O arquivo será baixado automaticamente com o nome `exames_epidemiologicos_YYYY-MM-DD.csv`
3. O arquivo contém todos os exames registrados no banco de dados, ordenados pela data de criação

### 19.2 Abrindo no Microsoft Excel

```
Passo 1: Abrir o Excel
Passo 2: Dados > Obter Dados Externos > De Texto/CSV
Passo 3: Selecionar o arquivo baixado
Passo 4: Configurar:
         - Delimitador: Ponto e vírgula (;)
         - Codificação: UTF-8
Passo 5: Clicar em Carregar
```

### 19.3 Importando no R (análise estatística)

```r
dados <- read.csv2(
  "exames_epidemiologicos_2026-06-01.csv",
  header = TRUE,
  sep = ";",
  encoding = "UTF-8",
  stringsAsFactors = FALSE
)

# Verificar estrutura dos dados
str(dados)

# Calcular CPOD médio da amostra
mean(dados$cpod_total, na.rm = TRUE)

# Distribuição de frequências do IHOS
table(cut(dados$ihos_total,
  breaks = c(0, 1.2, 2.0, 3.0),
  labels = c("Boa", "Regular", "Necessita Melhoria")))
```

### 19.4 Importando no SPSS

```spss
GET DATA
  /TYPE=TXT
  /FILE='exames_epidemiologicos_2026-06-01.csv'
  /DELCASE=LINE
  /DELIMITERS=";"
  /QUALIFIER='"'
  /ARRANGEMENT=DELIMITED
  /FIRSTCASE=2
  /IMPORTCASE=ALL
  /VARIABLES=
    participante A50
    idade F3.0
    sexo A1
    escola A100
    examinador A100
    data_coleta A10
    ihos_16 F1.0
    /* ... (repetir para todas as 56 colunas) */
    cpod_total F3.0.
EXECUTE.
```

---

## 20. REFERÊNCIAS METODOLÓGICAS

**Tabela 20.1** — Referências metodológicas utilizadas na concepção e desenvolvimento do EpiBucal.

| # | Referência | Aplicação no sistema |
|---|-----------|----------------------|
| 1 | WHO. *Oral Health Surveys: Basic Methods*. 5ª ed. Genebra: OMS, 2013. | Códigos 0–9 para condição da coroa; critérios para CPOD, IHOS, prótese e urgência |
| 2 | Brasil. Ministério da Saúde. *SBBrasil 2010: Pesquisa Nacional de Saúde Bucal*. Brasília: MS, 2012. | Adaptação nacional dos critérios OMS; ficha de exame epidemiológico |
| 3 | Brasil. Ministério da Saúde. *Projeto SBBrasil 2003*. Brasília: MS, 2004. | Referência histórica para levantamentos nacionais |
| 4 | KLEIN, H.; PALMER, C.E.; KNUTSON, J.W. Studies on dental caries: I. Dental status and dental needs of elementary school children. *Public Health Reports*, v. 53, p. 751-765, 1938. | Publicação original do índice CPOD |
| 5 | GREENE, J.C.; VERMILLION, J.R. The simplified oral hygiene index. *Journal of the American Dental Association*, v. 68, p. 7-13, 1964. | Publicação original do IHOS (escores 0–3 e dentes índice) |
| 6 | Fédération Dentaire Internationale (FDI). An international system of designating teeth. *International Dental Journal*, v. 21, n. 1, p. 104-106, 1971. | Sistema de numeração dentária de dois dígitos (11 a 48) |
| 7 | Lei n.º 13.709, de 14 de agosto de 2018. *Lei Geral de Proteção de Dados Pessoais (LGPD)*. Brasil, 2018. | Referência para implementação futura de controles de privacidade |

Fonte: Elaborado pelos autores (2026).

---

## APÊNDICE A — TABELA COMPLETA DOS 32 DENTES (FDI)

**Tabela A.1** — Numeração FDI, denominação e características de cada dente permanente examinado no EpiBucal.

| Número FDI | Denominação | Arcada | Quadrante | Dente índice IHOS |
|-----------|-------------|--------|-----------|:-----------------:|
| 18 | Terceiro molar superior direito | Superior | Direito | — |
| 17 | Segundo molar superior direito | Superior | Direito | — |
| **16** | **Primeiro molar superior direito** | Superior | Direito | **Sim** |
| 15 | Segundo pré-molar superior direito | Superior | Direito | — |
| 14 | Primeiro pré-molar superior direito | Superior | Direito | — |
| 13 | Canino superior direito | Superior | Direito | — |
| 12 | Incisivo lateral superior direito | Superior | Direito | — |
| **11** | **Incisivo central superior direito** | Superior | Direito | **Sim** |
| 21 | Incisivo central superior esquerdo | Superior | Esquerdo | — |
| 22 | Incisivo lateral superior esquerdo | Superior | Esquerdo | — |
| 23 | Canino superior esquerdo | Superior | Esquerdo | — |
| 24 | Primeiro pré-molar superior esquerdo | Superior | Esquerdo | — |
| 25 | Segundo pré-molar superior esquerdo | Superior | Esquerdo | — |
| **26** | **Primeiro molar superior esquerdo** | Superior | Esquerdo | **Sim** |
| 27 | Segundo molar superior esquerdo | Superior | Esquerdo | — |
| 28 | Terceiro molar superior esquerdo | Superior | Esquerdo | — |
| **31** | **Incisivo central inferior esquerdo** | Inferior | Esquerdo | **Sim** |
| 32 | Incisivo lateral inferior esquerdo | Inferior | Esquerdo | — |
| 33 | Canino inferior esquerdo | Inferior | Esquerdo | — |
| 34 | Primeiro pré-molar inferior esquerdo | Inferior | Esquerdo | — |
| 35 | Segundo pré-molar inferior esquerdo | Inferior | Esquerdo | — |
| **36** | **Primeiro molar inferior esquerdo** | Inferior | Esquerdo | **Sim** |
| 37 | Segundo molar inferior esquerdo | Inferior | Esquerdo | — |
| 38 | Terceiro molar inferior esquerdo | Inferior | Esquerdo | — |
| 41 | Incisivo central inferior direito | Inferior | Direito | — |
| 42 | Incisivo lateral inferior direito | Inferior | Direito | — |
| 43 | Canino inferior direito | Inferior | Direito | — |
| 44 | Primeiro pré-molar inferior direito | Inferior | Direito | — |
| 45 | Segundo pré-molar inferior direito | Inferior | Direito | — |
| **46** | **Primeiro molar inferior direito** | Inferior | Direito | **Sim** |
| 47 | Segundo molar inferior direito | Inferior | Direito | — |
| 48 | Terceiro molar inferior direito | Inferior | Direito | — |

Nota: Os dentes destacados em negrito são os seis dentes índice do IHOS (Greene e Vermillion, 1964).

Fonte: FDI (1971) apud WHO (2013).

---

## APÊNDICE B — GUIA DE CAPTURAS DE TELA (CHECKLIST)

Use esta lista para verificar que todas as capturas de tela foram realizadas antes de finalizar o manual ilustrado.

| # | Figura | Seção | Capturada? | Observações |
|---|--------|-------|:----------:|-------------|
| 1 | Figura 1.1 | Apresentação | ☐ | Tela inicial, formulário vazio |
| 2 | Figura 1.2 | Apresentação | ☐ | Cabeçalho com CPOD e IHOS calculados |
| 3 | Figura 3.1 | Funcionalidades | ☐ | Barra de navegação com 7 seções |
| 4 | Figura 4.1 | Arquitetura | ☐ | Diagrama (criar no Draw.io) |
| 5 | Figura 5.1 | Banco de dados | ☐ | Diagrama ER (criar no dbdiagram.io) |
| 6 | Figura 7.1 | Fluxograma | ☐ | Fluxograma (criar no Lucidchart) |
| 7 | Figura 8.1 | Tela Identificação | ☐ | Todos os campos preenchidos com dados fictícios |
| 8 | Figura 8.2 | Tela IHOS | ☐ | 6 dentes com escores variados |
| 9 | Figura 8.3 | Tela IHOS | ☐ | Painel resultado IHOS (3 variações) |
| 10 | Figura 8.4 | Tela Coroa | ☐ | Arcada superior com códigos coloridos |
| 11 | Figura 8.5 | Tela Coroa | ☐ | Arcada inferior expandida |
| 12 | Figura 8.6 | Tela Coroa | ☐ | Painel CPOD em tempo real |
| 13 | Figura 8.7 | Tela Prótese | ☐ | Uso de prótese superior e inferior |
| 14 | Figura 8.8 | Tela Prótese | ☐ | Necessidade de prótese |
| 15 | Figura 8.9 | Tela Urgência | ☐ | Todos os 5 botões com cores |
| 16 | Figura 8.10 | Tela Resumo | ☐ | Painel completo com todos os indicadores |
| 17 | Figura 8.11 | Botões de ação | ☐ | 4 botões visíveis |
| 18 | Figura 8.12 | Modal de exclusão | ☐ | Modal aberto sobre o formulário |
| 19 | Figura 9.1 | Validação | ☐ | Notificação de erro visível |
| 20 | Figura 9.2 | Validação | ☐ | Notificação de sucesso verde |
| 21 | Figura 10.1 | CPOD | ☐ | Cartões C, P, O, CPOD com valores |
| 22 | Figura 11.1 | IHOS | ☐ | Classificação Boa (verde) |
| 23 | Figura 11.2 | IHOS | ☐ | Classificação Regular (amarelo) |
| 24 | Figura 11.3 | IHOS | ☐ | Classificação Necessita Melhoria (vermelho) |
| 25 | Figura 14.1 | Exportação | ☐ | CSV aberto no Excel |
| 26 | Figura 18.1 | Manual do examinador | ☐ | Infográfico do fluxo operacional |

**Total: 26 figuras** (19 capturas de tela + 4 diagramas + 3 variações do IHOS)

---

## APÊNDICE C — EXEMPLO DE FICHA DE EXAME PREENCHIDA

```
======================================================
EXAME CLÍNICO EPIDEMIOLÓGICO — SAÚDE BUCAL
EpiBucal v1.0 · Registro de exemplo
======================================================
Participante : P042              Data : 01/06/2026
Idade        : 35 anos           Sexo : Feminino
Escola       : EM Monteiro Lobato
Examinador   : Dra. Ana Lima
------------------------------------------------------
IHOS:
  Dente 16: 1   Dente 11: 0   Dente 26: 2
  Dente 31: 1   Dente 36: 9   Dente 46: 1
  IHOS Total: 1,00 — Classificação: BOA
------------------------------------------------------
CONDIÇÃO DA COROA (código por dente):
  Sup.: 18:0 17:0 16:3 15:0 14:1 13:0 12:0 11:3
         21:0 22:0 23:0 24:0 25:0 26:0 27:0 28:8
  Inf.: 48:0 47:0 46:0 45:0 44:0 43:0 42:0 41:0
         31:0 32:0 33:0 34:0 35:4 36:5 37:0 38:8
------------------------------------------------------
CPOD:
  C = 1  (dente 14, código 1)
  P = 2  (dente 35 = código 4; dente 36 = código 5,
           incluído pois participante tem 35 anos ≥ 30)
  O = 2  (dentes 16 e 11, códigos 3 e 3)
  CPOD TOTAL = 5
------------------------------------------------------
PRÓTESE:
  Uso Superior: 0 (sem prótese)
  Uso Inferior: 0 (sem prótese)
  Nec. Superior: 0 (sem necessidade)
  Nec. Inferior: 1 (1 elemento)
------------------------------------------------------
URGÊNCIA: 2 (eletivo)
======================================================
```

---

*Manual Técnico e Operacional Ilustrado — EpiBucal v1.0*
*Gerado em junho de 2026*
*Para uso acadêmico, institucional e treinamento de pessoal*
