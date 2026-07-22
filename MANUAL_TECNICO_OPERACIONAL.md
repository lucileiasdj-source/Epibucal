# MANUAL TÉCNICO E OPERACIONAL
## SaudeBucalApp — Sistema de Coleta Epidemiológica em Saúde Bucal
### Versão 1.0 · Junho de 2026

---

> **Classificação:** Documento de uso acadêmico e institucional
> **Uso autorizado:** UniOpen, projetos de pesquisa, registro de software, treinamento de examinadores

---

## SUMÁRIO

1. [Apresentação do Sistema](#1-apresentação-do-sistema)
2. [Objetivos](#2-objetivos)
3. [Funcionalidades Implementadas](#3-funcionalidades-implementadas)
4. [Arquitetura do Sistema](#4-arquitetura-do-sistema)
5. [Estrutura do Banco de Dados](#5-estrutura-do-banco-de-dados)
6. [Dicionário Completo de Variáveis](#6-dicionário-completo-de-variáveis)
7. [Fluxograma de Funcionamento](#7-fluxograma-de-funcionamento)
8. [Descrição de Cada Tela](#8-descrição-de-cada-tela)
9. [Regras de Negócio](#9-regras-de-negócio)
10. [Cálculo Detalhado do CPOD](#10-cálculo-detalhado-do-cpod)
11. [Cálculo Detalhado do IHOS](#11-cálculo-detalhado-do-ihos)
12. [Uso e Necessidade de Prótese](#12-uso-e-necessidade-de-prótese)
13. [Necessidade de Tratamento](#13-necessidade-de-tratamento)
14. [Estrutura de Exportação CSV](#14-estrutura-de-exportação-csv)
15. [Validação dos Indicadores](#15-validação-dos-indicadores)
16. [Limitações Atuais do Sistema](#16-limitações-atuais-do-sistema)
17. [Melhorias Futuras](#17-melhorias-futuras)
18. [Manual Operacional para Examinadores](#18-manual-operacional-para-examinadores)
19. [Manual de Exportação dos Dados](#19-manual-de-exportação-dos-dados)
20. [Referências Metodológicas](#20-referências-metodológicas)

---

## 1. APRESENTAÇÃO DO SISTEMA

O **SaudeBucalApp** é uma plataforma digital de coleta de dados epidemiológicos em saúde bucal, desenvolvida para apoiar pesquisas de campo e levantamentos populacionais. O sistema digitaliza e estrutura o processo de exame clínico odontológico, permitindo o registro padronizado de indicadores como o Índice CPOD (Cariados, Perdidos e Obturados) e o IHOS (Índice de Higiene Oral Simplificado), além de condições de prótese e necessidade de tratamento.

A plataforma foi projetada com foco em **usabilidade em campo**, priorizando o uso em tablets e dispositivos móveis durante a realização de exames clínicos em ambiente escolar, unidades de saúde ou eventos institucionais como a **UniOpen**.

**Tecnologias utilizadas:**

| Camada | Tecnologia |
|--------|------------|
| Frontend | React 18 + TypeScript |
| Estilo | Tailwind CSS |
| Ícones | Lucide React |
| Backend (funções) | Supabase Edge Functions (Deno) |
| Banco de dados | PostgreSQL (Supabase) |
| Build | Vite 5 |

---

## 2. OBJETIVOS

### 2.1 Objetivo Geral

Prover uma ferramenta digital padronizada para coleta, armazenamento e exportação de dados epidemiológicos em saúde bucal, seguindo os critérios da Organização Mundial da Saúde (OMS) e do Ministério da Saúde do Brasil.

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

| # | Funcionalidade | Descrição |
|---|---------------|-----------|
| 1 | Identificação do participante | Registro de ID, idade, sexo, escola, examinador e data |
| 2 | Exame de higiene oral (IHOS) | Registro de placa bacteriana em 6 dentes índice |
| 3 | Condição da coroa dentária | Registro do código de condição para todos os 32 dentes permanentes |
| 4 | Uso de prótese | Registro do tipo de prótese em uso (superior e inferior) |
| 5 | Necessidade de prótese | Registro da necessidade protética (superior e inferior) |
| 6 | Urgência de tratamento | Classificação da necessidade de tratamento imediato |
| 7 | Cálculo automático do CPOD | Cálculo em tempo real com regra de idade para o componente P |
| 8 | Cálculo automático do IHOS | Cálculo em tempo real com exclusão automática do código 9 |
| 9 | Resumo visual do exame | Painel de indicadores antes do salvamento |
| 10 | Salvamento em nuvem | Persistência no banco de dados via Edge Function |
| 11 | Exportação CSV | Exportação de todos os exames em arquivo tabulado |
| 12 | Exclusão de registros | Limpeza completa do banco com confirmação dupla |
| 13 | Validação de formulário | Validação em duas camadas: frontend e backend |
| 14 | Painel administrativo | Módulo de auditoria de acesso (desabilitado por padrão) |
| 15 | Navegação por seções | Menu sticky com rolagem para seções do formulário |

---

## 4. ARQUITETURA DO SISTEMA

### 4.1 Visão Geral

```
┌─────────────────────────────────────────────────────────┐
│                      NAVEGADOR                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │           React SPA (App.tsx + componentes)        │ │
│  │                                                    │ │
│  │   ┌──────────────┐    ┌──────────────────────────┐ │ │
│  │   │  Formulário  │    │   Painel Administrativo  │ │ │
│  │   │  de Exame    │    │   (AdminPanel.tsx)       │ │ │
│  │   └──────┬───────┘    └──────────────────────────┘ │ │
│  │          │                                          │ │
│  │   ┌──────▼────────────────────────────────────────┐ │ │
│  │   │           supabase.ts (cliente SDK)           │ │ │
│  │   └──────┬──────────────────────────────────┬─────┘ │ │
│  └──────────┼──────────────────────────────────┼───────┘ │
└─────────────┼──────────────────────────────────┼─────────┘
              │ HTTPS                             │ HTTPS
              ▼                                   ▼
┌─────────────────────────┐    ┌──────────────────────────┐
│   Edge Functions (Deno) │    │   PostgreSQL (Supabase)   │
│                         │    │                           │
│  save-clinical-exam     │    │  exams                    │
│  delete-all-exams       │    │  tooth_records            │
│                         │    │  access_logs              │
└─────────────────────────┘    └──────────────────────────┘
```

### 4.2 Fluxo de Dados

```
Examinador preenche formulário
         │
         ▼
    Validação frontend
    (validateForm())
         │
    Passou? ──NÃO──► Notificação de erro ao usuário
         │SIM
         ▼
    Montagem do payload JSON
    (exam + dentes[])
         │
         ▼
    POST /functions/v1/save-clinical-exam
         │
         ▼
    Validação backend (Edge Function)
         │
    Passou? ──NÃO──► HTTP 422 + detalhes dos erros
         │SIM
         ▼
    INSERT INTO exams
         │
         ▼
    INSERT INTO tooth_records (32 registros)
         │
         ▼
    HTTP 201 ──► Notificação de sucesso
         │
         ▼
    Limpar formulário para próximo exame
```

### 4.3 Componentes do Sistema

| Arquivo | Responsabilidade |
|---------|-----------------|
| `src/App.tsx` | Componente principal: formulário completo, cálculos, exportação |
| `src/components/AdminPanel.tsx` | Painel de auditoria de acesso (opcional) |
| `src/lib/supabase.ts` | Instância singleton do cliente Supabase |
| `src/lib/accessTracking.ts` | Funções de rastreamento de acesso (desabilitado) |
| `supabase/functions/save-clinical-exam/index.ts` | Validação e persistência do exame |
| `supabase/functions/delete-all-exams/index.ts` | Exclusão em massa de registros |

---

## 5. ESTRUTURA DO BANCO DE DADOS

### 5.1 Tabela `exams`

Armazena os dados gerais de cada exame clínico realizado.

| Coluna | Tipo | Padrão | Descrição |
|--------|------|--------|-----------|
| `id` | UUID | gen_random_uuid() | Identificador único do exame |
| `participante` | text | — | Código ou nome do participante |
| `idade` | integer | — | Idade do participante em anos |
| `sexo` | text | — | Sexo biológico: "M" ou "F" |
| `escola` | text | — | Nome da escola ou local de coleta |
| `examinador` | text | — | Nome do examinador responsável |
| `data_coleta` | date | — | Data de realização do exame |
| `ihos_16` | integer | 9 | Escore IHOS do dente 16 |
| `ihos_11` | integer | 9 | Escore IHOS do dente 11 |
| `ihos_26` | integer | 9 | Escore IHOS do dente 26 |
| `ihos_31` | integer | 9 | Escore IHOS do dente 31 |
| `ihos_36` | integer | 9 | Escore IHOS do dente 36 |
| `ihos_46` | integer | 9 | Escore IHOS do dente 46 |
| `ihos_total` | numeric(5,2) | 0 | Média dos escores IHOS válidos |
| `uso_protese_superior` | integer | 9 | Código de uso de prótese superior |
| `uso_protese_inferior` | integer | 9 | Código de uso de prótese inferior |
| `necessidade_protese_superior` | integer | 9 | Código de necessidade de prótese superior |
| `necessidade_protese_inferior` | integer | 9 | Código de necessidade de prótese inferior |
| `urgencia_tratamento` | integer | 9 | Código de urgência de tratamento |
| `c_total` | integer | 0 | Total de dentes cariados (componente C) |
| `p_total` | integer | 0 | Total de dentes perdidos (componente P) |
| `o_total` | integer | 0 | Total de dentes obturados (componente O) |
| `cpod_total` | integer | 0 | Índice CPOD total |
| `created_at` | timestamptz | now() | Data/hora de criação do registro |

### 5.2 Tabela `tooth_records`

Armazena o código de condição para cada dente examinado, vinculado a um exame.

| Coluna | Tipo | Padrão | Descrição |
|--------|------|--------|-----------|
| `id` | UUID | gen_random_uuid() | Identificador único do registro |
| `exam_id` | UUID | — | FK → exams(id), ON DELETE CASCADE |
| `numero_dente` | integer | — | Número FDI do dente (11–48) |
| `codigo_coroa` | integer | 9 | Código de condição da coroa |
| `created_at` | timestamptz | now() | Data/hora de criação |

**Índice:** `idx_tooth_records_exam_id` sobre `exam_id` para performance de consultas.

**Integridade:** `ON DELETE CASCADE` garante que ao excluir um exame, todos os registros dentários associados são automaticamente excluídos.

### 5.3 Tabela `access_logs`

Armazena eventos de acesso para fins de auditoria e análise de uso da plataforma.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | Identificador único do evento |
| `session_id` | text | UUID de sessão gerado no sessionStorage |
| `event_type` | text | Tipo: `'page_load'` ou `'tab_navigation'` |
| `tab_name` | text (nullable) | Nome da seção acessada (apenas para tab_navigation) |
| `user_agent` | text | String do navegador/dispositivo (máx. 512 chars) |
| `created_at` | timestamptz | Data/hora do evento |

**Nota:** Esta tabela está implementada, mas a coleta de dados está desabilitada no código atual. Pode ser reativada removendo os comentários nas chamadas `logPageLoad()` e `logTabNavigation()`.

### 5.4 Políticas de Segurança (RLS)

| Tabela | Operação | Permissão |
|--------|----------|-----------|
| exams | SELECT | anon + authenticated |
| exams | INSERT | anon + authenticated |
| exams | UPDATE | anon + authenticated |
| tooth_records | SELECT | anon + authenticated |
| tooth_records | INSERT | anon + authenticated |
| tooth_records | UPDATE | anon + authenticated |
| access_logs | INSERT | anon + authenticated |
| access_logs | SELECT | authenticated only |

**Justificativa:** O acesso anônimo nas tabelas clínicas é necessário para suportar o uso em campo sem autenticação prévia dos examinadores. Esta configuração é adequada para ambientes controlados de pesquisa.

---

## 6. DICIONÁRIO COMPLETO DE VARIÁVEIS

### 6.1 Variáveis de Identificação

| Variável interna | Coluna no BD | Tipo | Descrição | Obrigatório |
|-----------------|-------------|------|-----------|-------------|
| `participantId` | `participante` | string | Código identificador do participante | Sim |
| `age` | `idade` | integer | Idade em anos completos (0–150) | Sim |
| `sex` | `sexo` | "M" \| "F" | Sexo biológico | Sim |
| `school` | `escola` | string | Local de coleta ou nome da escola | Não |
| `examiner` | `examinador` | string | Nome completo do examinador | Sim |
| `examDate` | `data_coleta` | date (YYYY-MM-DD) | Data de realização do exame | Sim |

### 6.2 Códigos de Condição da Coroa Dentária

| Código | Nome no sistema | Descrição epidemiológica | Inclusão no CPOD |
|--------|----------------|--------------------------|-----------------|
| 0 | Hígido | Dente sadio, sem lesão de cárie | Não |
| 1 | Cariado | Presença de cavidade ativa por cárie | C (sim) |
| 2 | Rest. c/ cárie | Restauração com cárie presente | O (sim) |
| 3 | Rest. s/ cárie | Restauração sem cárie presente | O (sim) |
| 4 | Perdido p/ cárie | Dente ausente por extração devido à cárie | P (sempre) |
| 5 | Perdido outra | Dente ausente por outra causa | P (apenas se idade ≥ 30) |
| 6 | Selante | Selante de fóssulas e fissuras presente | Não (contado separado) |
| 7 | Ponte/Coroa/Impl. | Prótese fixa, coroa ou implante | Não (contado separado) |
| 8 | Não erupcionado | Dente ainda não erupcionado | Não |
| 9 | Não registrado | Ausência de registro (valor padrão) | Não |

### 6.3 Dentes Examinados (Numeração FDI)

**Arcada Superior:**
```
18 · 17 · 16 · 15 · 14 · 13 · 12 · 11 | 21 · 22 · 23 · 24 · 25 · 26 · 27 · 28
```

**Arcada Inferior:**
```
48 · 47 · 46 · 45 · 44 · 43 · 42 · 41 | 31 · 32 · 33 · 34 · 35 · 36 · 37 · 38
```

**Variáveis de dentes no CSV:** `d11` a `d48` (prefixo `d` + número FDI)

### 6.4 Variáveis do IHOS

| Variável interna | Coluna no BD | Dente | Posição |
|-----------------|-------------|-------|---------|
| `ihos[16]` | `ihos_16` | Primeiro molar superior direito | Vestibular |
| `ihos[11]` | `ihos_11` | Incisivo central superior direito | Vestibular |
| `ihos[26]` | `ihos_26` | Primeiro molar superior esquerdo | Vestibular |
| `ihos[31]` | `ihos_31` | Incisivo central inferior esquerdo | Lingual |
| `ihos[36]` | `ihos_36` | Primeiro molar inferior esquerdo | Lingual |
| `ihos[46]` | `ihos_46` | Primeiro molar inferior direito | Lingual |
| `ihosTotal` | `ihos_total` | — | Média dos escores válidos |

**Escores IHOS:**

| Código | Descrição | Área coberta por placa |
|--------|-----------|----------------------|
| 0 | Sem placa | Nenhuma |
| 1 | Até 1/3 | Até 1/3 da superfície |
| 2 | 1/3 a 2/3 | Entre 1/3 e 2/3 da superfície |
| 3 | Mais de 2/3 | Mais de 2/3 da superfície |
| 9 | Não registrado | Dente ausente ou não avaliado (excluído do cálculo) |

### 6.5 Variáveis de Prótese

**Uso de Prótese:**

| Código | Descrição | Variável superior | Variável inferior |
|--------|-----------|------------------|------------------|
| 0 | Sem prótese | `uso_protese_superior` | `uso_protese_inferior` |
| 1 | Prótese parcial | — | — |
| 2 | Prótese total | — | — |
| 9 | Não registrado (padrão) | — | — |

**Necessidade de Prótese:**

| Código | Descrição | Variável superior | Variável inferior |
|--------|-----------|------------------|------------------|
| 0 | Sem necessidade | `necessidade_protese_superior` | `necessidade_protese_inferior` |
| 1 | 1 elemento | — | — |
| 2 | Mais de 1 elemento | — | — |
| 3 | Prótese total | — | — |
| 9 | Não registrado (padrão) | — | — |

### 6.6 Variável de Urgência de Tratamento

| Código | Descrição | Coluna no BD |
|--------|-----------|-------------|
| 0 | Sem necessidade | `urgencia_tratamento` |
| 1 | Preventivo | — |
| 2 | Eletivo | — |
| 3 | Urgente | — |
| 9 | Não registrado (padrão) | — |

### 6.7 Variáveis Calculadas (CPOD)

| Variável | Coluna no BD | Descrição |
|----------|-------------|-----------|
| `cCount` | `c_total` | Contagem de dentes com código 1 |
| `pCount` | `p_total` | Contagem de dentes perdidos (ver regra de idade) |
| `oCount` | `o_total` | Contagem de dentes com códigos 2 ou 3 |
| `cpodTotal` | `cpod_total` | Soma: cCount + pCount + oCount |
| `sCount` | `s_total` | Contagem de dentes com código 6 (selantes) |
| `prCount` | `pr_total` | Contagem de dentes com código 7 (pontes/coroas) |

---

## 7. FLUXOGRAMA DE FUNCIONAMENTO

### 7.1 Fluxo Completo do Exame

```
INÍCIO
  │
  ▼
┌─────────────────────────────────────────┐
│  SEÇÃO 1: IDENTIFICAÇÃO                 │
│  • ID do participante                   │
│  • Idade, sexo, escola                  │
│  • Examinador, data                     │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  SEÇÃO 2: IHOS                          │
│  • Registrar escore (0–3 ou 9) para     │
│    dentes: 16, 11, 26, 31, 36, 46       │
│  • Sistema calcula média automaticamente│
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  SEÇÃO 3: CONDIÇÃO DA COROA             │
│  • Registrar código (0–9) para cada     │
│    um dos 32 dentes permanentes         │
│  • CPOD calculado automaticamente       │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  SEÇÃO 4: USO DE PRÓTESE                │
│  • Selecionar código para superior      │
│  • Selecionar código para inferior      │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  SEÇÃO 5: NECESSIDADE DE PRÓTESE        │
│  • Selecionar código para superior      │
│  • Selecionar código para inferior      │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  SEÇÃO 6: URGÊNCIA DE TRATAMENTO        │
│  • Selecionar nível de urgência         │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  SEÇÃO 7: RESUMO                        │
│  • Verificar CPOD, IHOS, prótese        │
│  • Confirmar dados antes de salvar      │
└──────────────────┬──────────────────────┘
                   │
                   ▼
             [SALVAR EXAME]
                   │
          ┌────────┴────────┐
          │ Validação OK?   │
          └────────┬────────┘
               SIM │        NÃO
                   │         └──► Exibe erros
                   ▼             Permanece no formulário
          Salvar no banco
                   │
                   ▼
          Notificação de sucesso
                   │
                   ▼
          Formulário limpo
          (pronto para o próximo participante)
                   │
                   ▼
                 FIM
```

### 7.2 Fluxo de Cálculo CPOD

```
Para cada um dos 32 dentes:
  código == 1? ──SIM──► cCount++
  código == 2 ou 3? ──SIM──► oCount++
  código == 4? ──SIM──► pCount++
  código == 5 E idade >= 30? ──SIM──► pCount++

cpodTotal = cCount + pCount + oCount
```

### 7.3 Fluxo de Cálculo IHOS

```
Para cada dente índice [16, 11, 26, 31, 36, 46]:
  escore == 9? ──SIM──► ignorar (não entra na média)
               ──NÃO──► incluir na lista de escores válidos

ihosTotal = soma(escores válidos) / quantidade(escores válidos)

Se nenhum dente foi registrado: ihosTotal = null (exibido como "--")
```

---

## 8. DESCRIÇÃO DE CADA TELA

### 8.1 Cabeçalho

Exibido permanentemente no topo da página. Contém o título "Exame Clínico" e o subtítulo "Formulário de exame clínico". Inclui indicadores em tempo real:

- **CPOD Total** — valor numérico calculado instantaneamente
- **IHOS Total** — média calculada dos escores registrados

### 8.2 Navegação por Seções

Menu horizontal com rolagem automática, fixo ao topo durante a navegação. Contém 7 botões de acesso rápido às seções do formulário:

| # | Ícone | Rótulo |
|---|-------|--------|
| 1 | User | Identificação |
| 2 | ClipboardList | IHOS |
| 3 | Tooth (SVG) | Condição da Coroa |
| 4 | Smile | Uso de Prótese |
| 5 | Activity | Necess. Prótese |
| 6 | ShieldAlert | Urgência |
| 7 | Calculator | Resumo |

### 8.3 Seção 1 — Identificação

Campos de texto para dados do participante:

- **ID do Participante** (obrigatório) — campo de texto livre, ex.: `P001`
- **Idade** (obrigatório) — campo numérico, valores válidos: 0–150
- **Sexo** (obrigatório) — seletor: Masculino / Feminino
- **Escola / Local** (opcional) — campo de texto livre
- **Examinador** (obrigatório) — campo de texto livre
- **Data da Coleta** (obrigatório) — seletor de data, padrão: data atual

### 8.4 Seção 2 — IHOS

Grade de 6 dentes índice. Para cada dente, exibe:

- Número FDI do dente
- 5 botões de código: 0, 1, 2, 3, 9
- Cor do botão muda conforme o código selecionado
- Painel de resumo exibindo o IHOS Total calculado com barra colorida e classificação

**Classificação visual:**

| Faixa | Classificação | Cor |
|-------|--------------|-----|
| 0,0 – 1,2 | Boa | Verde (emerald) |
| 1,3 – 2,0 | Regular | Amarelo (amber) |
| 2,1 – 3,0 | Necessita Melhoria | Vermelho (red) |

### 8.5 Seção 3 — Condição da Coroa

Grade de dentes dividida em duas arcadas expansíveis:

- **Arcada Superior** (dentes 18 a 28): 16 dentes em linha
- **Arcada Inferior** (dentes 48 a 31): 16 dentes em linha

Para cada dente:
- Número FDI exibido em destaque
- 10 botões de código: 0 a 9
- Cor do dente muda conforme o código selecionado
- Painel lateral com contadores C, P, O e CPOD total atualizados em tempo real

### 8.6 Seção 4 — Uso de Prótese

Dois grupos de seleção (Superior e Inferior) com 4 opções cada:

- 0: Sem prótese
- 1: Prótese parcial
- 2: Prótese total
- 9: Não registrado

Botões com cores distintas por categoria de resposta.

### 8.7 Seção 5 — Necessidade de Prótese

Dois grupos de seleção (Superior e Inferior) com 5 opções cada:

- 0: Sem necessidade
- 1: 1 elemento
- 2: Mais de 1 elemento
- 3: Prótese total
- 9: Não registrado

### 8.8 Seção 6 — Urgência de Tratamento

Seleção única com 5 opções:

- 0: Sem necessidade (verde)
- 1: Preventivo (azul)
- 2: Eletivo (amarelo)
- 3: Urgente (vermelho)
- 9: Não registrado (branco)

### 8.9 Seção 7 — Resumo

Painel consolidado com todos os indicadores calculados:

**Bloco CPOD:**
- C Total / P Total / O Total / CPOD Total em cartões individuais

**Bloco IHOS:**
- Valor numérico + classificação com badge colorido

**Distribuição das Condições da Coroa:**
- Grid 6 colunas: Hígido / Cariado / Restaurado / Perdido / Selante / Prótese

**Botões de ação:**
- Salvar Exame (azul)
- Exportar CSV (verde)
- Limpar (cinza)
- Excluir Exames Salvos (vermelho, com confirmação)

---

## 9. REGRAS DE NEGÓCIO

### 9.1 Validação do Formulário (Frontend)

Executada na função `validateForm()` antes de qualquer chamada ao servidor:

| Campo | Regra | Mensagem de erro |
|-------|-------|-----------------|
| Participante | Não pode estar vazio | "Informe o ID do participante" |
| Idade | Inteiro entre 0 e 150 | "Informe uma idade válida (0-150)" |
| Sexo | Deve ser "M" ou "F" | "Selecione o sexo" |
| Examinador | Não pode estar vazio | "Informe o nome do examinador" |
| Data | Não pode estar vazia | "Informe a data de coleta" |

### 9.2 Validação do Backend (Edge Function)

Camada adicional de validação no servidor. Campos validados:

- `participante`: obrigatório, string não vazia
- `idade`: obrigatório, inteiro entre 0 e 120
- `sexo`: obrigatório, valores aceitos: `["M", "F", "masculino", "feminino", "m", "f"]`
- `escola`: obrigatório, string não vazia
- `examinador`: obrigatório, string não vazia
- `data_coleta`: obrigatório, data válida
- `uso_protese_superior/inferior`: obrigatório, valor em `[0,1,2,3,4,5,9]`
- `necessidade_protese_superior/inferior`: obrigatório, valor em `[0,1,2,3,4,5,9]`
- `urgencia_tratamento`: obrigatório, valor em `[0,1,2,9]`
- `c_total`, `p_total`, `o_total`, `cpod_total`: obrigatórios, inteiros não negativos
- `dentes`: array obrigatório, não vazio
- Cada dente: `numero_dente` deve ser FDI válido; `codigo_coroa` deve estar em `[0–9]`

### 9.3 Regra de Negócio do Componente P (CPOD)

Esta é a principal regra de negócio do sistema:

```
SE idade < 30 anos:
    P = contagem de dentes com código 4

SE idade >= 30 anos:
    P = contagem de dentes com código 4 + contagem de dentes com código 5
```

**Justificativa:** Em indivíduos com menos de 30 anos, a maioria das ausências dentárias é por cárie. Em adultos com 30 anos ou mais, perdas por outras causas (doença periodontal, trauma, razões ortodônticas) passam a ser epidemiologicamente relevantes e devem ser incluídas no componente P do CPOD.

**Implementação:**
```typescript
const ageNum = parseInt(age);
const includeCode5 = !isNaN(ageNum) && ageNum >= 30;
pCount = Object.values(teeth).filter(
  (c) => c === 4 || (includeCode5 && c === 5)
).length;
```

### 9.4 Regra de Exclusão do IHOS

O código `9` (não registrado) é **sempre excluído** do cálculo da média do IHOS. Isso permite que o exame seja realizado mesmo quando alguns dentes índice estão ausentes ou não podem ser avaliados.

### 9.5 Regra de Confirmação para Exclusão

Ao clicar em "Excluir Exames Salvos", o sistema exige confirmação explícita do usuário antes de executar a operação. A exclusão é irreversível e remove todos os registros do banco de dados.

---

## 10. CÁLCULO DETALHADO DO CPOD

### 10.1 Definição do Índice

O CPOD é o índice epidemiológico padrão para avaliar a experiência de cárie na dentição permanente, proposto por Klein e Palmer em 1937 e adotado pela OMS. Representa a **média de dentes Cariados, Perdidos e Obturados** por indivíduo na população estudada.

### 10.2 Fórmula Implementada

```
CPOD = C + P + O

onde:

C = número de dentes com código 1 (cariados)

P = número de dentes com código 4 (perdidos por cárie)
  + número de dentes com código 5 (perdidos outra causa) *APENAS se idade ≥ 30*

O = número de dentes com código 2 (restaurados com cárie)
  + número de dentes com código 3 (restaurados sem cárie)
```

### 10.3 Exemplo Prático

**Participante com 25 anos de idade:**

| Dente | Código | Classificação |
|-------|--------|--------------|
| 16 | 1 | Cariado (C) |
| 11 | 3 | Restaurado s/ cárie (O) |
| 26 | 4 | Perdido p/ cárie (P) |
| 36 | 5 | Perdido outra causa (NÃO entra no P) |
| 46 | 2 | Restaurado c/ cárie (O) |
| Demais | 0 | Hígidos |

**Cálculo:**
- C = 1 (dente 16)
- P = 1 (dente 26, código 4) | dente 36 ignorado pois idade < 30
- O = 2 (dentes 11 e 46)
- **CPOD = 1 + 1 + 2 = 4**

---

**Mesmo participante com 35 anos de idade:**
- C = 1 (dente 16)
- P = 2 (dente 26, código 4) + (dente 36, código 5, **incluído** pois idade ≥ 30)
- O = 2 (dentes 11 e 46)
- **CPOD = 1 + 2 + 2 = 5**

### 10.4 Variáveis Auxiliares do CPOD

| Variável | Código | Descrição | Incluso no CPOD |
|----------|--------|-----------|-----------------|
| `sCount` | 6 | Selantes de fóssulas | Não |
| `prCount` | 7 | Pontes, coroas, implantes | Não |

Estas variáveis são coletadas e exportadas no CSV para análise complementar, mas não compõem o índice CPOD.

---

## 11. CÁLCULO DETALHADO DO IHOS

### 11.1 Definição do Índice

O Índice de Higiene Oral Simplificado (IHOS), proposto por Greene e Vermillion (1964), avalia a presença de placa bacteriana e cálculo dentário em superfícies específicas de 6 dentes índice.

### 11.2 Dentes Índice

| Dente | Quadrante | Superfície avaliada |
|-------|-----------|-------------------|
| 16 | Superior direito | Vestibular |
| 11 | Superior direito | Vestibular |
| 26 | Superior esquerdo | Vestibular |
| 31 | Inferior esquerdo | Lingual |
| 36 | Inferior esquerdo | Lingual |
| 46 | Inferior direito | Lingual |

### 11.3 Escores

| Escore | Critério clínico |
|--------|-----------------|
| 0 | Superfície livre de detritos ou manchas |
| 1 | Detritos moles cobrindo até 1/3 da superfície dentária |
| 2 | Detritos moles cobrindo mais de 1/3, mas menos de 2/3 |
| 3 | Detritos moles cobrindo mais de 2/3 da superfície |
| 9 | Dente ausente ou impossibilidade de registro |

### 11.4 Fórmula

```
IHOS Total = Σ (escores válidos) / n (dentes com escore ≠ 9)
```

**Implementação:**
```typescript
const validScores = [16, 11, 26, 31, 36, 46]
  .map((t) => ihos[t])
  .filter((v) => v !== 9);

ihosTotal = validScores.reduce((sum, v) => sum + v, 0) / validScores.length;
```

### 11.5 Classificação

| Faixa | Classificação | Interpretação |
|-------|--------------|---------------|
| 0,0 – 1,2 | **Boa** | Higiene oral adequada |
| 1,3 – 2,0 | **Regular** | Higiene oral parcialmente comprometida |
| 2,1 – 3,0 | **Necessita Melhoria** | Higiene oral deficiente |

### 11.6 Exemplo Prático

| Dente | Escore |
|-------|--------|
| 16 | 1 |
| 11 | 0 |
| 26 | 2 |
| 31 | 9 (ausente — excluído) |
| 36 | 1 |
| 46 | 2 |

**Cálculo:**
- Escores válidos: [1, 0, 2, 1, 2]
- Soma: 1 + 0 + 2 + 1 + 2 = 6
- Quantidade: 5 dentes
- IHOS = 6 / 5 = **1,20**
- Classificação: **Boa** (≤ 1,2)

---

## 12. USO E NECESSIDADE DE PRÓTESE

### 12.1 Uso de Prótese

Avalia se o participante utiliza algum tipo de prótese dentária no momento do exame.

**Avaliação:** Realizada separadamente para arcada superior e inferior.

| Código | Descrição |
|--------|-----------|
| 0 | Não usa prótese |
| 1 | Usa prótese parcial removível ou fixa |
| 2 | Usa prótese total (completa) |
| 9 | Não registrado |

### 12.2 Necessidade de Prótese

Avalia a necessidade de reabilitação protética conforme avaliação do examinador.

**Avaliação:** Realizada separadamente para arcada superior e inferior.

| Código | Descrição |
|--------|-----------|
| 0 | Sem necessidade de prótese |
| 1 | Necessita reposição de 1 elemento |
| 2 | Necessita reposição de mais de 1 elemento |
| 3 | Necessita prótese total |
| 9 | Não registrado |

---

## 13. NECESSIDADE DE TRATAMENTO

### 13.1 Urgência de Tratamento

Campo único que classifica a necessidade global de tratamento do participante.

| Código | Descrição | Definição clínica |
|--------|-----------|------------------|
| 0 | Sem necessidade | Ausência de condições que requeiram tratamento |
| 1 | Preventivo | Necessita apenas de orientações e procedimentos preventivos |
| 2 | Eletivo | Necessita de tratamento, mas sem caráter de urgência |
| 3 | Urgente | Presença de dor, infecção, traumatismo ou comprometimento sistêmico |
| 9 | Não registrado | Avaliação não realizada |

---

## 14. ESTRUTURA DE EXPORTAÇÃO CSV

### 14.1 Formato do Arquivo

| Parâmetro | Valor |
|-----------|-------|
| Formato | CSV (Comma-Separated Values) |
| Delimitador | Ponto e vírgula (`;`) |
| Codificação | UTF-8 |
| Nome do arquivo | `exames_epidemiologicos_YYYY-MM-DD.csv` |
| Cabeçalho | Sim (primeira linha) |

### 14.2 Colunas do Arquivo CSV (56 colunas)

| # | Coluna | Tipo | Descrição |
|---|--------|------|-----------|
| 1 | `participante` | texto | Código ou nome do participante |
| 2 | `idade` | inteiro | Idade em anos |
| 3 | `sexo` | texto | "M" ou "F" |
| 4 | `escola` | texto | Nome da escola ou local |
| 5 | `examinador` | texto | Nome do examinador |
| 6 | `data_coleta` | data | Data no formato YYYY-MM-DD |
| 7 | `ihos_16` | inteiro | Escore IHOS do dente 16 (0-3, 9) |
| 8 | `ihos_11` | inteiro | Escore IHOS do dente 11 (0-3, 9) |
| 9 | `ihos_26` | inteiro | Escore IHOS do dente 26 (0-3, 9) |
| 10 | `ihos_31` | inteiro | Escore IHOS do dente 31 (0-3, 9) |
| 11 | `ihos_36` | inteiro | Escore IHOS do dente 36 (0-3, 9) |
| 12 | `ihos_46` | inteiro | Escore IHOS do dente 46 (0-3, 9) |
| 13 | `ihos_total` | decimal | Média IHOS calculada (2 casas decimais) |
| 14 | `d18` | inteiro | Código da coroa do dente 18 (0-9) |
| 15 | `d17` | inteiro | Código da coroa do dente 17 |
| 16 | `d16` | inteiro | Código da coroa do dente 16 |
| 17 | `d15` | inteiro | Código da coroa do dente 15 |
| 18 | `d14` | inteiro | Código da coroa do dente 14 |
| 19 | `d13` | inteiro | Código da coroa do dente 13 |
| 20 | `d12` | inteiro | Código da coroa do dente 12 |
| 21 | `d11` | inteiro | Código da coroa do dente 11 |
| 22 | `d21` | inteiro | Código da coroa do dente 21 |
| 23 | `d22` | inteiro | Código da coroa do dente 22 |
| 24 | `d23` | inteiro | Código da coroa do dente 23 |
| 25 | `d24` | inteiro | Código da coroa do dente 24 |
| 26 | `d25` | inteiro | Código da coroa do dente 25 |
| 27 | `d26` | inteiro | Código da coroa do dente 26 |
| 28 | `d27` | inteiro | Código da coroa do dente 27 |
| 29 | `d28` | inteiro | Código da coroa do dente 28 |
| 30 | `d48` | inteiro | Código da coroa do dente 48 |
| 31 | `d47` | inteiro | Código da coroa do dente 47 |
| 32 | `d46` | inteiro | Código da coroa do dente 46 |
| 33 | `d45` | inteiro | Código da coroa do dente 45 |
| 34 | `d44` | inteiro | Código da coroa do dente 44 |
| 35 | `d43` | inteiro | Código da coroa do dente 43 |
| 36 | `d42` | inteiro | Código da coroa do dente 42 |
| 37 | `d41` | inteiro | Código da coroa do dente 41 |
| 38 | `d31` | inteiro | Código da coroa do dente 31 |
| 39 | `d32` | inteiro | Código da coroa do dente 32 |
| 40 | `d33` | inteiro | Código da coroa do dente 33 |
| 41 | `d34` | inteiro | Código da coroa do dente 34 |
| 42 | `d35` | inteiro | Código da coroa do dente 35 |
| 43 | `d36` | inteiro | Código da coroa do dente 36 |
| 44 | `d37` | inteiro | Código da coroa do dente 37 |
| 45 | `d38` | inteiro | Código da coroa do dente 38 |
| 46 | `uso_protese_superior` | inteiro | Código de uso de prótese superior (0-2, 9) |
| 47 | `uso_protese_inferior` | inteiro | Código de uso de prótese inferior (0-2, 9) |
| 48 | `necessidade_protese_superior` | inteiro | Código de necessidade de prótese superior (0-3, 9) |
| 49 | `necessidade_protese_inferior` | inteiro | Código de necessidade de prótese inferior (0-3, 9) |
| 50 | `urgencia_tratamento` | inteiro | Código de urgência de tratamento (0-3, 9) |
| 51 | `c_total` | inteiro | Total de dentes cariados (componente C) |
| 52 | `p_total` | inteiro | Total de dentes perdidos (componente P) |
| 53 | `o_total` | inteiro | Total de dentes obturados (componente O) |
| 54 | `cpod_total` | inteiro | Índice CPOD total |
| 55 | `s_total` | inteiro | Total de selantes (código 6) |
| 56 | `pr_total` | inteiro | Total de pontes/coroas/implantes (código 7) |

### 14.3 Exemplo de Linha CSV

```
P001;12;M;Escola Municipal;Dr. Silva;2026-06-01;0;1;1;9;0;2;0.80;9;9;0;9;9;0;0;1;3;9;9;9;9;1;9;9;9;9;9;0;9;9;9;0;0;4;9;9;9;9;3;9;9;0;9;0;9;1;1;3;5;0;0
```

---

## 15. VALIDAÇÃO DOS INDICADORES

### 15.1 Indicadores de Qualidade dos Dados

Para verificar a integridade dos dados exportados, recomenda-se:

| Verificação | Regra esperada |
|-------------|---------------|
| Valores de código de dente | Devem estar entre 0 e 9 |
| Valores de IHOS por dente | Devem ser 0, 1, 2, 3 ou 9 |
| CPOD Total | Deve ser ≤ 32 |
| c_total + p_total + o_total | Deve ser igual a cpod_total |
| Idade | Deve estar entre 0 e 150 |
| Sexo | Deve ser "M" ou "F" |
| IHOS Total | Deve estar entre 0,00 e 3,00 ou NULL |
| ihos_total | Deve ser coerente com a média dos ihos_16 a ihos_46 |

### 15.2 Consistência do CPOD com Idade

| Situação | Verificação |
|----------|-------------|
| Participante < 30 anos com p_total contendo códigos 5 | Sinalizar inconsistência |
| cpod_total > 28 | Verificar — apenas 28 dentes permanentes não-terceiros-molares são avaliados convencionalmente |
| Todos os 32 dentes com código 4 ou 5 | Possível edêntulo total — verificar campo de uso de prótese |

---

## 16. LIMITAÇÕES ATUAIS DO SISTEMA

| # | Limitação | Impacto | Prioridade de resolução |
|---|-----------|---------|------------------------|
| 1 | Sem autenticação de usuários | Qualquer pessoa com acesso à URL pode usar o sistema | Alta |
| 2 | Sem validação de duplicatas | O sistema permite salvar múltiplos exames com o mesmo ID de participante | Alta |
| 3 | RLS permissiva (anon access) | Qualquer usuário anônimo pode ler e inserir dados | Alta |
| 4 | Sem suporte a exame dentário misto (decíduo + permanente) | Limita uso em crianças < 6 anos | Média |
| 5 | Sem modo offline | Exige conexão com internet para salvar | Média |
| 6 | Sem exportação XLSX nativa | Usuários precisam converter o CSV manualmente | Baixa |
| 7 | Painel administrativo desabilitado | Monitoramento de acesso não está ativo | Baixa |
| 8 | Ausência de controle de versão de formulário | Mudanças no formulário afetam todo o histórico | Média |
| 9 | Sem campo de observações por dente | Não é possível registrar notas clínicas individuais | Baixa |
| 10 | Sem geração de laudo individual | O sistema não gera um relatório por participante | Média |

---

## 17. MELHORIAS FUTURAS

| # | Melhoria | Benefício | Complexidade |
|---|----------|-----------|-------------|
| 1 | Autenticação por examinador | Rastreabilidade e controle de acesso | Média |
| 2 | Suporte a dentição decídua (CEOD/ceod) | Abrangência para crianças | Alta |
| 3 | Modo offline com sincronização | Trabalho em campo sem internet | Alta |
| 4 | Geração de laudo PDF por participante | Uso clínico direto | Média |
| 5 | Dashboard de análise epidemiológica | Visualização de dados em tempo real | Alta |
| 6 | Exportação para SPSS/R nativa | Facilitar análise estatística | Baixa |
| 7 | Multi-idioma (PT/EN/ES) | Uso em pesquisas internacionais | Média |
| 8 | Calibração de examinadores (concordância) | Controle de qualidade do estudo | Alta |
| 9 | Histórico de edições com auditoria | Conformidade com LGPD | Média |
| 10 | Integração com sistemas de saúde (RNDS) | Interoperabilidade nacional | Muito alta |
| 11 | Questionário socioeconômico integrado | Dados contextuais para análise | Baixa |
| 12 | Randomização automática de participantes | Suporte a estudos com seleção amostral | Média |

---

## 18. MANUAL OPERACIONAL PARA EXAMINADORES

### 18.1 Pré-requisitos

- Acesso à plataforma via navegador (Chrome, Safari, Edge, Firefox)
- Conexão com internet para salvar os exames
- Dispositivo: computador, tablet ou smartphone
- Treinamento em critérios OMS para levantamentos epidemiológicos

### 18.2 Início de Sessão de Coleta

1. Abra o navegador e acesse a URL da plataforma
2. A tela inicial exibirá o formulário pronto para preenchimento
3. Verifique se a data do exame está correta no campo "Data da Coleta"

### 18.3 Preenchimento do Formulário

**Passo 1 — Identificação:**
- Insira o código do participante (ex.: `E001`, `P025`)
- Registre a idade em anos completos
- Selecione o sexo biológico
- Preencha a escola ou local de coleta (quando aplicável)
- Confirme seu nome no campo "Examinador"
- Confirme a data da coleta

**Passo 2 — IHOS (Higiene Oral):**
- Para cada um dos 6 dentes índice, pressione o código correspondente:
  - **0**: Superfície sem placa
  - **1**: Placa em até 1/3 da superfície
  - **2**: Placa entre 1/3 e 2/3 da superfície
  - **3**: Placa em mais de 2/3 da superfície
  - **9**: Dente ausente ou não avaliável
- O IHOS Total será calculado automaticamente

**Passo 3 — Condição da Coroa:**
- Para cada dente, pressione o código correspondente:
  - **0**: Dente hígido (saudável, sem lesão)
  - **1**: Cárie ativa (cavidade presente)
  - **2**: Restauração com cárie
  - **3**: Restauração sem cárie
  - **4**: Dente ausente (extraído por cárie)
  - **5**: Dente ausente (por outra causa)
  - **6**: Selante de fóssulas e fissuras
  - **7**: Coroa, ponte ou implante
  - **8**: Dente não erupcionado
  - **9**: Não registrado (padrão)

> **Atenção:** O sistema aplica automaticamente a regra de idade para o cálculo do componente P:
> - Participante com menos de 30 anos: apenas código 4 compõe o P
> - Participante com 30 anos ou mais: códigos 4 e 5 compõem o P

**Passo 4 — Uso de Prótese:**
- Selecione o tipo de prótese em uso para a arcada superior
- Selecione o tipo de prótese em uso para a arcada inferior
- Se não há prótese, selecione **0**
- Se não foi possível avaliar, mantenha **9**

**Passo 5 — Necessidade de Prótese:**
- Avalie a necessidade reabilitadora superior e inferior
- Utilize os critérios da OMS para necessidade protética

**Passo 6 — Urgência de Tratamento:**
- Selecione o nível de urgência global do participante
- **3 (Urgente)**: Dor, infecção ativa, traumatismo recente

**Passo 7 — Revisar o Resumo:**
- Verifique os valores de CPOD e IHOS exibidos
- Confirme a distribuição das condições dentárias
- Se houver algum erro, retorne às seções anteriores pelo menu de navegação

### 18.4 Salvamento do Exame

1. Clique no botão **"Salvar Exame"** (azul)
2. Aguarde a confirmação (notificação verde no topo)
3. O formulário será automaticamente limpo para o próximo participante
4. **Não feche o navegador durante o salvamento**

### 18.5 Erros Comuns

| Mensagem de erro | Causa | Solução |
|-----------------|-------|---------|
| "Informe o ID do participante" | Campo participante vazio | Preencher o campo |
| "Informe uma idade válida" | Idade fora do intervalo 0–150 | Corrigir a idade |
| "Selecione o sexo" | Sexo não selecionado | Selecionar M ou F |
| "Informe o nome do examinador" | Campo examinador vazio | Preencher o campo |
| "Erro ao salvar" | Falha de conexão | Verificar internet e tentar novamente |

### 18.6 Limpeza do Formulário

- **"Limpar"**: Apaga todos os dados do formulário atual (não afeta exames já salvos)
- O sistema pede confirmação antes de limpar

---

## 19. MANUAL DE EXPORTAÇÃO DOS DADOS

### 19.1 Exportando o Arquivo CSV

1. Na tela principal, clique no botão **"Exportar CSV"** (verde)
2. O arquivo será baixado automaticamente com o nome `exames_epidemiologicos_YYYY-MM-DD.csv`
3. O arquivo contém todos os exames registrados no banco de dados

### 19.2 Abrindo no Microsoft Excel

1. Abra o Excel
2. Vá em: **Dados > Obter Dados Externos > De Texto/CSV**
3. Selecione o arquivo baixado
4. Quando solicitado:
   - Delimitador: **Ponto e vírgula (;)**
   - Codificação: **UTF-8**
5. Clique em **Carregar**

### 19.3 Abrindo no LibreOffice Calc

1. Arraste o arquivo para o LibreOffice Calc
   - Ou: **Arquivo > Abrir**
2. Na janela de importação:
   - Selecione delimitador: **Ponto e vírgula**
   - Codificação: **Unicode (UTF-8)**
3. Clique em **OK**

### 19.4 Importando no SPSS

```spss
GET DATA
  /TYPE=TXT
  /FILE='caminho/para/exames_epidemiologicos_2026-06-01.csv'
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
    ...
```

### 19.5 Importando no R

```r
dados <- read.csv2(
  "exames_epidemiologicos_2026-06-01.csv",
  header = TRUE,
  sep = ";",
  encoding = "UTF-8",
  stringsAsFactors = FALSE
)

# Verificar estrutura
str(dados)
summary(dados$cpod_total)
mean(dados$cpod_total, na.rm = TRUE)
```

### 19.6 Excluindo Todos os Exames

> **ATENÇÃO: Esta operação é irreversível. Exporte os dados antes de excluir.**

1. Clique em **"Excluir Exames Salvos"** (vermelho)
2. Uma caixa de confirmação será exibida
3. Confirme a exclusão
4. Todos os registros serão permanentemente removidos

---

## 20. REFERÊNCIAS METODOLÓGICAS

### 20.1 Normas e Diretrizes

1. **WHO. Oral Health Surveys: Basic Methods.** 5th edition. World Health Organization, 2013.
   - Base metodológica para os códigos de condição da coroa (0–9)
   - Critérios para o índice CPOD
   - Critérios para uso e necessidade de prótese
   - Critérios para urgência de tratamento

2. **Brasil. Ministério da Saúde. SBBrasil 2010: Pesquisa Nacional de Saúde Bucal.** Brasília: Ministério da Saúde, 2012.
   - Adaptação nacional dos critérios OMS
   - Ficha de exame epidemiológico padronizada

3. **Brasil. Ministério da Saúde. Projeto SBBrasil 2003: Condições de Saúde Bucal da População Brasileira.** Brasília: Ministério da Saúde, 2004.

### 20.2 Índice CPOD

4. **Klein H, Palmer CE, Knutson JW.** Studies on dental caries: I. Dental status and dental needs of elementary school children. *Public Health Reports*, 1938;53:751-765.
   - Publicação original do índice CPOD

### 20.3 Índice IHOS

5. **Greene JC, Vermillion JR.** The simplified oral hygiene index. *Journal of the American Dental Association*, 1964;68:7-13.
   - Publicação original do Índice de Higiene Oral Simplificado (IHOS)

### 20.4 Numeração Dentária FDI

6. **Fédération Dentaire Internationale (FDI).** An international system of designating teeth. *International Dental Journal*, 1971;21(1):104-106.
   - Sistema de numeração dentária de dois dígitos utilizado no sistema

### 20.5 LGPD e Proteção de Dados

7. **Lei n.º 13.709, de 14 de agosto de 2018.** Lei Geral de Proteção de Dados Pessoais (LGPD). Brasil, 2018.
   - Referência para a implementação futura de controles de privacidade

---

## APÊNDICE A — CODIFICAÇÃO COMPLETA DOS DENTES

| FDI | Posição | Arcada | IHOS |
|-----|---------|--------|------|
| 18 | 3º molar superior direito | Superior | — |
| 17 | 2º molar superior direito | Superior | — |
| 16 | 1º molar superior direito | Superior | **Sim** |
| 15 | 2º pré-molar superior direito | Superior | — |
| 14 | 1º pré-molar superior direito | Superior | — |
| 13 | Canino superior direito | Superior | — |
| 12 | Incisivo lateral superior direito | Superior | — |
| 11 | Incisivo central superior direito | Superior | **Sim** |
| 21 | Incisivo central superior esquerdo | Superior | — |
| 22 | Incisivo lateral superior esquerdo | Superior | — |
| 23 | Canino superior esquerdo | Superior | — |
| 24 | 1º pré-molar superior esquerdo | Superior | — |
| 25 | 2º pré-molar superior esquerdo | Superior | — |
| 26 | 1º molar superior esquerdo | Superior | **Sim** |
| 27 | 2º molar superior esquerdo | Superior | — |
| 28 | 3º molar superior esquerdo | Superior | — |
| 31 | Incisivo central inferior esquerdo | Inferior | **Sim** |
| 32 | Incisivo lateral inferior esquerdo | Inferior | — |
| 33 | Canino inferior esquerdo | Inferior | — |
| 34 | 1º pré-molar inferior esquerdo | Inferior | — |
| 35 | 2º pré-molar inferior esquerdo | Inferior | — |
| 36 | 1º molar inferior esquerdo | Inferior | **Sim** |
| 37 | 2º molar inferior esquerdo | Inferior | — |
| 38 | 3º molar inferior esquerdo | Inferior | — |
| 41 | Incisivo central inferior direito | Inferior | — |
| 42 | Incisivo lateral inferior direito | Inferior | — |
| 43 | Canino inferior direito | Inferior | — |
| 44 | 1º pré-molar inferior direito | Inferior | — |
| 45 | 2º pré-molar inferior direito | Inferior | — |
| 46 | 1º molar inferior direito | Inferior | **Sim** |
| 47 | 2º molar inferior direito | Inferior | — |
| 48 | 3º molar inferior direito | Inferior | — |

---

## APÊNDICE B — EXEMPLO DE FICHA DE EXAME PREENCHIDA

```
======================================================
EXAME CLÍNICO EPIDEMIOLÓGICO — SAÚDE BUCAL
======================================================
Participante: P042          Data: 01/06/2026
Idade: 35 anos              Sexo: F
Escola: EM Monteiro Lobato  Examinador: Dra. Ana Lima
------------------------------------------------------
IHOS:
  Dente 16: 1  | Dente 11: 0  | Dente 26: 2
  Dente 31: 1  | Dente 36: 9  | Dente 46: 1
  IHOS Total: 1,00 — Classificação: BOA
------------------------------------------------------
CONDIÇÃO DA COROA:
  18:0  17:0  16:3  15:0  14:1  13:0  12:0  11:3
  21:0  22:0  23:0  24:0  25:0  26:0  27:0  28:8
  48:0  47:0  46:0  45:0  44:0  43:0  42:0  41:0
  31:0  32:0  33:0  34:0  35:4  36:5  37:0  38:8
------------------------------------------------------
CPOD:
  C = 1 (dente 14)
  P = 2 (d35=código4) + (d36=código5, incluído pois 35 anos ≥ 30)
  O = 2 (dentes 16 e 11)
  CPOD TOTAL = 5
------------------------------------------------------
PRÓTESE:
  Uso Superior: 0 (sem prótese)    Uso Inferior: 0 (sem prótese)
  Nec. Superior: 0 (sem nec.)      Nec. Inferior: 1 (1 elemento)
------------------------------------------------------
URGÊNCIA: 2 (eletivo)
======================================================
```

---

*Documento gerado em junho de 2026.*
*SaudeBucalApp v1.0 — Plataforma de Coleta Epidemiológica em Saúde Bucal*
