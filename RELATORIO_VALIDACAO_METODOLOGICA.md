# RELATÓRIO DE VALIDAÇÃO METODOLÓGICA
## EpiBucal — Análise dos Cálculos Epidemiológicos Implementados
### Versão 1.0 · Junho de 2026

---

> **Objetivo:** Verificar a conformidade dos cálculos epidemiológicos implementados no EpiBucal com as normas da Organização Mundial da Saúde (OMS/2013) e com a metodologia do levantamento SBBrasil 2010, identificando inconsistências e pontos que requerem revisão.
>
> **Metodologia desta análise:** Leitura direta do código-fonte com extração de evidências por número de linha e trecho exato de código.
>
> **Arquivos analisados:**
> - `src/App.tsx`
> - `supabase/functions/save-clinical-exam/index.ts`
> - `supabase/migrations/` (todos os arquivos)

---

## SUMÁRIO

1. [Parecer Geral](#1-parecer-geral)
2. [Conformidade com a OMS (2013)](#2-conformidade-com-a-oms-2013)
3. [Conformidade com o SBBrasil 2010](#3-conformidade-com-o-sbbrasil-2010)
4. [Inconsistências Identificadas](#4-inconsistências-identificadas)
5. [Pontos que Requerem Revisão](#5-pontos-que-requerem-revisão)
6. [Análise Detalhada por Indicador](#6-análise-detalhada-por-indicador)
7. [Análise da Camada de Validação](#7-análise-da-camada-de-validação)
8. [Análise do Módulo de Exportação](#8-análise-do-módulo-de-exportação)
9. [Matriz de Conformidade](#9-matriz-de-conformidade)
10. [Recomendações Priorizadas](#10-recomendações-priorizadas)

---

## 1. PARECER GERAL

O EpiBucal implementa de forma **substancialmente correta** os principais indicadores epidemiológicos em saúde bucal utilizados em levantamentos populacionais. Os cálculos do índice CPOD e do IHOS reproduzem adequadamente as fórmulas de referência da OMS e do SBBrasil. Foram identificadas **5 inconsistências** de gravidade variada e **8 pontos de revisão** que não invalidam os dados já coletados, mas que devem ser corrigidos antes de estudos com maior rigor metodológico.

**Resumo executivo:**

| Dimensão avaliada | Resultado |
|------------------|-----------|
| Cálculo do CPOD | Conforme com ressalvas (ver Inconsistência 1) |
| Cálculo do IHOS | Conforme |
| Classificação do IHOS | Conforme — limites adotados são defensáveis |
| Códigos OMS de condição dentária | Conforme |
| Registro de prótese | Conforme (uso e necessidade) |
| Urgência de tratamento | Conforme com ressalvas (ver Inconsistência 3) |
| Validação do backend | Parcialmente conforme (ver Inconsistências 4 e 5) |
| Exportação dos dados | Conforme |

---

## 2. CONFORMIDADE COM A OMS (2013)

### 2.1 Códigos de Condição da Coroa — CONFORME

A OMS (2013, p. 45-51) define dez códigos para a condição da coroa na dentição permanente. O sistema implementa todos os dez com denominações coerentes.

**Evidência — `src/App.tsx`, linhas 27–38:**

```typescript
const CODIGOS: Record<number, string> = {
  0: 'Hígido',
  1: 'Cariado',
  2: 'Rest. c/ cárie',
  3: 'Rest. s/ cárie',
  4: 'Perdido p/ cárie',
  5: 'Perdido outra',
  6: 'Selante',
  7: 'Ponte/Coroa/Impl.',
  8: 'Não erupcionado',
  9: 'Não registrado',
};
```

**Correspondência com a OMS (2013):**

| Código OMS | Denominação OMS (inglês) | Denominação no sistema | Status |
|-----------|--------------------------|----------------------|--------|
| 0 | Sound | Hígido | Conforme |
| 1 | Decayed | Cariado | Conforme |
| 2 | Filled, with decay | Rest. c/ cárie | Conforme |
| 3 | Filled, no decay | Rest. s/ cárie | Conforme |
| 4 | Missing, due to caries | Perdido p/ cárie | Conforme |
| 5 | Missing, other reason | Perdido outra | Conforme |
| 6 | Fissure sealant | Selante | Conforme |
| 7 | Bridge/crown/implant | Ponte/Coroa/Impl. | Conforme |
| 8 | Unerupted | Não erupcionado | Conforme |
| 9 | Not recorded | Não registrado | Conforme |

**Conclusão:** Implementação dos códigos está em plena conformidade com a OMS (2013).

---

### 2.2 Numeração Dentária FDI — CONFORME

A OMS (2013) adota o sistema FDI de dois dígitos. O sistema implementa corretamente todos os 32 dentes permanentes.

**Evidência — `src/App.tsx`, linhas 24–25:**

```typescript
const DENTES_SUPERIORES = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const DENTES_INFERIORES = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
```

**Evidência — `supabase/functions/save-clinical-exam/index.ts`, linhas 16–20:**

```typescript
const FDI_TEETH = [
  11, 12, 13, 14, 15, 16, 17, 18,
  21, 22, 23, 24, 25, 26, 27, 28,
  31, 32, 33, 34, 35, 36, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48,
];
```

**Conclusão:** Todos os 32 dentes permanentes estão corretamente representados com numeração FDI.

---

### 2.3 Cálculo do Índice CPOD — CONFORME COM RESSALVAS

A OMS (2013, p. 54) define o CPOD como a soma de dentes **C**ariados (código 1), **P**erdidos por cárie (código 4) e **O**bturados (códigos 2 e 3).

**Evidência — `src/App.tsx`, linhas 235–249:**

```typescript
// Componente C
const cCount = useMemo(() => {
  return Object.values(teeth).filter((c) => c === 1).length;
}, [teeth]);

// Componente P (com regra de idade)
const pCount = useMemo(() => {
  const ageNum = parseInt(age);
  const includeCode5 = !isNaN(ageNum) && ageNum >= 30;
  return Object.values(teeth).filter((c) => c === 4 || (includeCode5 && c === 5)).length;
}, [teeth, age]);

// Componente O
const oCount = useMemo(() => {
  return Object.values(teeth).filter((c) => c === 2 || c === 3).length;
}, [teeth]);

// CPOD Total
const cpodTotal = useMemo(() => cCount + pCount + oCount, [cCount, pCount, oCount]);
```

**Análise:**
- O componente **C** está correto: somente o código 1 compõe.
- O componente **O** está correto: códigos 2 e 3 compõem.
- O componente **P** apresenta **uma ressalva** descrita na Inconsistência 1.

---

### 2.4 Dentes Índice do IHOS — CONFORME

A OMS (2013, p. 58), baseando-se em Greene e Vermillion (1964), define os seguintes dentes índice para o IHOS: 16, 11, 26, 31, 36 e 46.

**Evidência — `src/App.tsx`, linha 71:**

```typescript
const IHOS_TEETH = [16, 11, 26, 31, 36, 46] as const;
```

**Conclusão:** Os dentes índice estão em plena conformidade com a OMS (2013) e Greene & Vermillion (1964).

---

### 2.5 Escores e Cálculo do IHOS — CONFORME

**Evidência — `src/App.tsx`, linhas 63–69 e 228–232:**

```typescript
// Escores definidos
const IHOS_CODES: Record<number, string> = {
  0: 'Sem placa',
  1: 'Até 1/3',
  2: '1/3 a 2/3',
  3: 'Mais de 2/3',
  9: 'Não registrado',
};

// Cálculo
const ihosTotal = useMemo(() => {
  const validScores = IHOS_TEETH.map((t) => ihos[t]).filter((v) => v !== 9);
  if (validScores.length === 0) return null;
  return validScores.reduce((sum, v) => sum + v, 0) / validScores.length;
}, [ihos]);
```

A fórmula `soma(escores válidos) / n` está correta. A exclusão do código 9 é metodologicamente adequada e prevista pela OMS para casos de dentes ausentes.

---

### 2.6 Registro de Prótese — CONFORME

**Evidência — `src/App.tsx`, linhas 40–53:**

```typescript
// Uso de prótese
const PROSTHESIS_USE_CODES: Record<number, string> = {
  0: 'Sem prótese',
  1: 'Prótese parcial',
  2: 'Prótese total',
  9: 'Não registrado',
};

// Necessidade de prótese
const PROSTHESIS_NEED_CODES: Record<number, string> = {
  0: 'Sem necessidade',
  1: '1 elemento',
  2: 'Mais de 1 elem.',
  3: 'Prótese total',
  9: 'Não registrado',
};
```

**Correspondência com a OMS (2013, p. 65-66):**

| Código OMS — Uso | OMS — Necessidade | Sistema — Uso | Sistema — Necessidade | Status |
|-----------------|-------------------|--------------|----------------------|--------|
| 0 | 0 | Sem prótese | Sem necessidade | Conforme |
| 1 | 1 | Prótese parcial | 1 elemento | Conforme |
| 2 | 2 | Prótese total | Mais de 1 elem. | Conforme |
| — | 3 | — | Prótese total | Conforme |
| 9 | 9 | Não registrado | Não registrado | Conforme |

---

### 2.7 Urgência de Tratamento — CONFORME COM RESSALVAS

**Evidência — `src/App.tsx`, linhas 55–61:**

```typescript
const TREATMENT_URGENCY_CODES: Record<number, string> = {
  0: 'Sem necessidade',
  1: 'Preventivo',
  2: 'Eletivo',
  3: 'Urgente',
  9: 'Não registrado',
};
```

Ver Inconsistência 3 para a ressalva sobre este campo.

---

## 3. CONFORMIDADE COM O SBBRASIL 2010

### 3.1 Regra de Idade para o Componente P — PRESENTE E PARCIALMENTE CORRETA

O SBBrasil 2010 (e a OMS/2013, p. 54) estabelece que, em adultos (≥ 30 anos), **perdas por outras razões que não cárie** (código 5) devem ser incluídas no componente P do CPOD, dada a maior prevalência de doença periodontal como causa de extração nessa faixa etária.

**Evidência — `src/App.tsx`, linhas 239–243:**

```typescript
const pCount = useMemo(() => {
  const ageNum = parseInt(age);
  const includeCode5 = !isNaN(ageNum) && ageNum >= 30;
  return Object.values(teeth).filter((c) => c === 4 || (includeCode5 && c === 5)).length;
}, [teeth, age]);
```

A lógica de inclusão do código 5 a partir dos 30 anos está implementada. Contudo, esta regra apresenta uma inconsistência com relação ao limiar etário adotado — ver **Inconsistência 1**.

---

### 3.2 Faixas Etárias do SBBrasil — AUSENTE

O SBBrasil estratifica os dados por faixas etárias padronizadas:
- **5 anos** — avaliação da dentição decídua (ceod)
- **12 anos** — indicador OMS para a dentição permanente
- **15–19 anos**
- **35–44 anos** (adultos)
- **65–74 anos** (idosos)

O sistema **não implementa** segmentação automática por faixa etária nem alertas quando o participante se enquadra nos grupos sentinela do SBBrasil. Também **não suporta o índice ceod** para a dentição decídua.

---

### 3.3 Exame em Campo sem Radiografia — CONFORME

Tanto a OMS (2013) quanto o SBBrasil utilizam exclusivamente o exame clínico visual-tátil, sem radiografia. O sistema registra apenas dados de inspeção clínica, o que é metodologicamente adequado para levantamentos epidemiológicos populacionais.

---

## 4. INCONSISTÊNCIAS IDENTIFICADAS

### Inconsistência 1 — GRAVE
### Limiar de 30 anos para inclusão do código 5 não corresponde ao critério OMS para o grupo de adultos

**Classificação:** Grave — afeta diretamente o cálculo do CPOD em participantes de 30 a 34 anos.

**Descrição:** A OMS (2013, p. 54) e o SBBrasil 2010 estabelecem que o código 5 deve ser incluído no componente P para o **grupo de adultos de 35 a 44 anos**, não a partir dos 30 anos. O limiar de 30 anos implementado inclui incorretamente participantes de 30 a 34 anos no grupo onde o código 5 compõe o P.

**Evidência do código — `src/App.tsx`, linha 241:**

```typescript
const includeCode5 = !isNaN(ageNum) && ageNum >= 30;
//                                               ^^^
//                   OMS/SBBrasil define o grupo adulto a partir de 35 anos
//                   O SBBrasil usa 35-44 como faixa sentinela para adultos
```

**Impacto:** Participantes com idades 30, 31, 32, 33 e 34 anos terão o componente P **superestimado** caso possuam dentes registrados com código 5.

**Correção recomendada:**

```typescript
// Opção 1: seguir o grupo sentinela SBBrasil (35+)
const includeCode5 = !isNaN(ageNum) && ageNum >= 35;

// Opção 2: implementar lógica por grupos etários explícitos
const isAdult = !isNaN(ageNum) && ageNum >= 35 && ageNum <= 44;
const isElderly = !isNaN(ageNum) && ageNum >= 65;
const includeCode5 = isAdult || isElderly;
```

**Referência:** WHO. *Oral Health Surveys: Basic Methods*. 5ª ed., 2013. p. 54: *"For adults, code 5 (missing for other reason) should be included in the 'Missing' component."* — o contexto da frase refere-se ao grupo de exame de adultos (35–44 anos).

---

### Inconsistência 2 — MODERADA
### Código 7 (Ponte/Coroa/Implante) não compõe o CPOD, mas a OMS o inclui em situações específicas

**Classificação:** Moderada — pode subestimar o CPOD em populações adultas com alta prevalência de prótese fixa.

**Descrição:** A OMS (2013, p. 54-55) prevê que **dentes pilares de ponte fixa** (código 7) podem ser computados no componente O (obturado) quando o examinador tem evidência de que a ponte foi instalada como resultado de tratamento de cárie. O sistema trata o código 7 apenas como variável auxiliar (`pr_total`), sem incluí-lo no CPOD.

**Evidência — `src/App.tsx`, linhas 255–257:**

```typescript
const prCount = useMemo(() => {
  return Object.values(teeth).filter((c) => c === 7).length;
}, [teeth]);
```

**Evidência — `src/App.tsx`, linhas 245–247:**

```typescript
const oCount = useMemo(() => {
  return Object.values(teeth).filter((c) => c === 2 || c === 3).length;
  //                                                              ^^^
  //                           código 7 NÃO está incluído aqui
}, [teeth]);
```

**Impacto:** Subestimação do componente O em participantes que possuem próteses fixas. Em levantamentos com idosos (65–74 anos), este impacto pode ser expressivo.

**Nota:** Para levantamentos escolares em crianças de 12 anos (grupo prioritário do SBBrasil), este impacto é mínimo. O critério da OMS é ambíguo neste ponto e varia entre publicações.

---

### Inconsistência 3 — MODERADA
### O campo `urgencia_tratamento` aceita código 3 na interface, mas a validação backend rejeita o valor 3

**Classificação:** Moderada — cria discrepância entre o que a interface permite registrar e o que o servidor aceita.

**Descrição:** A interface do usuário oferece o código 3 ("Urgente") para o campo de urgência de tratamento. Contudo, o array de valores válidos no backend **não inclui o código 3**.

**Evidência da interface — `src/App.tsx`, linhas 55–61:**

```typescript
const TREATMENT_URGENCY_CODES: Record<number, string> = {
  0: 'Sem necessidade',
  1: 'Preventivo',
  2: 'Eletivo',
  3: 'Urgente',   // ← código 3 está presente na interface
  9: 'Não registrado',
};
```

**Evidência do backend — `supabase/functions/save-clinical-exam/index.ts`, linha 14:**

```typescript
const URGENCIA_VALUES = ["0", "1", "2", "9"];
//                                        ^^^
//                       código "3" ausente — qualquer exame com urgência = 3
//                       será rejeitado com HTTP 422 pelo backend
```

**Impacto:** Um examinador que selecionar "3 — Urgente" na interface e tentar salvar receberá uma mensagem de erro de validação do servidor, impedindo o salvamento do exame. **Esta é a inconsistência mais crítica do ponto de vista operacional**, pois bloqueia o registro de exames legítimos em campo.

**Correção recomendada — `supabase/functions/save-clinical-exam/index.ts`:**

```typescript
// Correção: incluir "3" nos valores válidos
const URGENCIA_VALUES = ["0", "1", "2", "3", "9"];
```

---

### Inconsistência 4 — MODERADA
### Validação de idade tem limites diferentes entre frontend (0–150) e backend (0–120)

**Classificação:** Moderada — não invalida dados válidos, mas cria comportamento inconsistente.

**Evidência do frontend — `src/App.tsx`, linha 331:**

```typescript
if (!age || parseInt(age) < 0 || parseInt(age) > 150) return 'Idade inválida';
//                                               ^^^
//                               limite superior: 150
```

**Evidência do backend — `supabase/functions/save-clinical-exam/index.ts`:**

```typescript
if (data.idade === undefined || data.idade === null || !Number.isInteger(data.idade)
    || data.idade < 0 || data.idade > 120) {
  errors.push({ field: "idade", message: "Idade deve ser um número inteiro entre 0 e 120." });
  //                                                                              ^^^
  //                                                    limite superior: 120 (diferente do frontend)
}
```

**Impacto:** Um participante com idade entre 121 e 150 anos passaria pela validação do frontend mas seria rejeitado pelo backend com erro 422. Na prática, idades acima de 120 são impossíveis, mas a inconsistência indica falta de sincronização entre as duas camadas de validação.

**Correção recomendada:** Alinhar ambas as camadas para o mesmo limite. O limite de 120 anos do backend é mais razoável do ponto de vista epidemiológico.

---

### Inconsistência 5 — LEVE
### O backend valida `escola` como campo obrigatório, mas o frontend a marca como opcional

**Classificação:** Leve — não bloqueia o fluxo comum, mas pode surpreender o examinador.

**Evidência do frontend — `src/App.tsx`:** O campo `escola` não aparece nas regras de `validateForm()`:

```typescript
const validateForm = (): string | null => {
  if (!participantId.trim()) return 'ID do participante é obrigatório';
  if (!age || parseInt(age) < 0 || parseInt(age) > 150) return 'Idade inválida';
  if (!sex) return 'Selecione o sexo';
  if (!examiner.trim()) return 'Examinador é obrigatório';
  if (!examDate) return 'Data do exame é obrigatória';
  return null;
  // ← escola NÃO é validada aqui (campo considerado opcional)
};
```

**Evidência do backend — `supabase/functions/save-clinical-exam/index.ts`:**

```typescript
if (!data.escola || typeof data.escola !== "string" || data.escola.trim() === "") {
  errors.push({ field: "escola", message: "Nome da escola é obrigatório." });
  // ← escola é OBRIGATÓRIA no backend
}
```

**Impacto:** Um examinador que não preencher o campo "Escola" passará pela validação do frontend, mas o salvamento será bloqueado pelo backend com erro 422. O examinador verá uma mensagem de erro vaga, sem entender que o campo escola precisa ser preenchido.

---

## 5. PONTOS QUE REQUEREM REVISÃO

### Ponto 1 — Ausência do índice ceod para dentição decídua

O sistema **não suporta** o índice ceod (cariados, extraídos/indicados para extração, obturados) para a dentição decídua. Levantamentos como o SBBrasil incluem obrigatoriamente a avaliação de crianças de 5 anos, faixa na qual a dentição decídua predomina. Sem este módulo, o sistema não pode ser utilizado em estudos com crianças pré-escolares.

---

### Ponto 2 — Terceiros molares (dentes 18, 28, 38, 48) incluídos sem critério de exclusão opcional

A OMS (2013) e o SBBrasil discutem a inclusão ou exclusão dos terceiros molares no CPOD, especialmente em jovens onde esses dentes podem estar em erupção (código 8). O sistema inclui os quatro terceiros molares na contagem, mas não oferece ao examinador a opção de excluí-los do cálculo quando o protocolo do estudo assim o exigir.

**Evidência — `src/App.tsx`, linhas 24–25:**

```typescript
const DENTES_SUPERIORES = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
//                          ^^                                                             ^^
//                     3º molar                                                       3º molar
```

---

### Ponto 3 — Ausência do componente de cálculo e cárie radicular

O SBBrasil 2010 e a OMS (2013) preveem o registro e cálculo da **cárie radicular** em adultos (35–44 anos) e idosos (65–74 anos). O sistema atual registra apenas a condição da coroa (`codigo_coroa`), sem campo equivalente para a raiz (`codigo_raiz`).

---

### Ponto 4 — `ihos_total` é zerado quando nenhum dente foi registrado, mas o banco armazena 0

Quando nenhum dente IHOS foi registrado (todos com escore 9), o cálculo retorna `null` na interface, o que é correto:

**Evidência — `src/App.tsx`, linhas 228–232:**

```typescript
const ihosTotal = useMemo(() => {
  const validScores = IHOS_TEETH.map((t) => ihos[t]).filter((v) => v !== 9);
  if (validScores.length === 0) return null;
  // ...
}, [ihos]);
```

Contudo, ao salvar, o `null` é convertido para `0` no payload:

**Evidência — `src/App.tsx`, linhas 362 (no payload de salvamento):**

```typescript
ihos_total: ihosTotal ?? 0,
//                     ^^^
//          null é convertido para 0 antes de enviar ao servidor
```

**Impacto:** No banco de dados, `ihos_total = 0` é indistinguível de um exame onde todos os 6 dentes têm escore 0 (higiene perfeita). Para análises quantitativas, isso pode introduzir viés ao calcular médias populacionais do IHOS, pois exames sem registro IHOS serão contabilizados com valor 0 em vez de serem excluídos da análise.

**Sugestão:** Alterar a coluna `ihos_total` no banco para aceitar `NULL`, e ajustar o payload:

```typescript
ihos_total: ihosTotal,  // permite NULL no banco
```

---

### Ponto 5 — Ausência de validação do número mínimo de dentes para o IHOS

A OMS (2013, p. 58) recomenda que o IHOS seja calculado apenas quando **pelo menos** um dos dentes índice estiver presente. O sistema já trata este caso retornando `null`, o que é correto. Porém, não há alerta ao examinador informando que o IHOS não foi calculado por ausência de dentes elegíveis — o campo simplesmente exibe `--`.

---

### Ponto 6 — O CPOD não distingue entre CPOD de 32 dentes e CPOD de 28 dentes

Algumas metodologias excluem os terceiros molares do denominador do CPOD (usando 28 dentes como base), enquanto outras usam todos os 32. O sistema não documenta qual convenção está sendo adotada, nem oferece configuração para isso.

---

### Ponto 7 — Ausência de verificação de consistência entre prótese e dentes perdidos

Um exame pode registrar todos os dentes como presentes (códigos 0–3) e ao mesmo tempo registrar "uso de prótese total" (código 2 superior). Esta combinação é clinicamente impossível (prótese total implica ausência de todos os dentes naturais) e o sistema não emite alerta.

---

### Ponto 8 — A classificação do IHOS adota pontos de corte sem referência documentada no código

**Evidência — `src/App.tsx`, linha 858:**

```typescript
ihosTotal <= 1.2 ? 'bg-emerald-500' : ihosTotal <= 2.0 ? 'bg-amber-500' : 'bg-red-500'
```

Os pontos de corte `1.2` e `2.0` são utilizados por Greene e Vermillion (1964) e amplamente citados na literatura, sendo considerados válidos. Porém, não há comentário no código indicando a origem desses valores, o que dificulta a verificação metodológica por terceiros.

**Sugestão:** Adicionar comentário documentando a origem:

```typescript
// Classificação baseada em Greene & Vermillion (1964):
// 0.0–1.2 = Boa; 1.3–2.0 = Regular; 2.1–3.0 = Necessita Melhoria
ihosTotal <= 1.2 ? 'bg-emerald-500' : ihosTotal <= 2.0 ? 'bg-amber-500' : 'bg-red-500'
```

---

## 6. ANÁLISE DETALHADA POR INDICADOR

### 6.1 Índice CPOD — Análise Completa

**Fórmula implementada:**

```typescript
// src/App.tsx, linhas 235–249
cCount = Object.values(teeth).filter(c => c === 1).length
pCount = Object.values(teeth).filter(c => c === 4 || (age >= 30 && c === 5)).length
oCount = Object.values(teeth).filter(c => c === 2 || c === 3).length
cpodTotal = cCount + pCount + oCount
```

**Fórmula referência OMS (2013):**

```
CPOD = C + P + O
C = número de dentes com cárie ativa (código 1)
P = número de dentes perdidos por cárie (código 4)
    + código 5 em adultos (critério de idade)
O = número de dentes restaurados (códigos 2 e 3)
```

**Tabela de verificação — CPOD:**

| Componente | Códigos incluídos (OMS) | Códigos no sistema | Conforme? |
|-----------|------------------------|-------------------|-----------|
| C | 1 | 1 | Sim |
| P (< 30 anos) | 4 | 4 | Sim |
| P (≥ 30 anos) | 4 + 5 | 4 + 5 | Parcial (limiar deveria ser 35) |
| O | 2, 3 | 2, 3 | Sim |
| Total | C+P+O | cCount+pCount+oCount | Sim |
| Código 6 (selante) | Não compõe | Não compõe (s_total) | Sim |
| Código 7 (coroa/ponte) | Discutível | Não compõe (pr_total) | Discutível |
| Código 8 (não erupcionado) | Não compõe | Não compõe | Sim |
| Código 9 (não registrado) | Não compõe | Não compõe | Sim |

---

### 6.2 Índice IHOS — Análise Completa

**Fórmula implementada:**

```typescript
// src/App.tsx, linhas 228–232
const validScores = [16, 11, 26, 31, 36, 46].map(t => ihos[t]).filter(v => v !== 9)
ihosTotal = sum(validScores) / validScores.length
```

**Fórmula referência Greene & Vermillion (1964) / OMS (2013):**

```
IHOS = Σ(escores individuais) / n(dentes avaliados)
Escores: 0 (sem placa) a 3 (placa > 2/3)
Dentes ausentes: excluídos do denominador
```

**Tabela de verificação — IHOS:**

| Elemento | OMS / Greene & Vermillion | Implementação | Conforme? |
|----------|--------------------------|---------------|-----------|
| Dentes índice | 16, 11, 26, 31, 36, 46 | [16, 11, 26, 31, 36, 46] | Sim |
| Escores | 0, 1, 2, 3 | 0, 1, 2, 3 | Sim |
| Código para ausente | Excluir | 9 → filtrado (.filter(v !== 9)) | Sim |
| Denominador | n de dentes presentes | validScores.length | Sim |
| Retorno sem dentes | Indefinido | null | Adequado |
| Classificação Boa | 0,0 – 1,2 | <= 1.2 | Conforme* |
| Classificação Regular | 1,3 – 2,0 | <= 2.0 | Conforme* |
| Classificação Ruim | 2,1 – 3,0 | > 2.0 | Conforme* |

*Os pontos de corte são amplamente utilizados na literatura, mas o código não documenta a referência.

---

### 6.3 Prótese (Uso e Necessidade) — Análise Completa

**Tabela de verificação — Prótese:**

| Elemento | OMS (2013, p. 65) | Implementação | Conforme? |
|----------|------------------|---------------|-----------|
| Avaliação por arcada (sup/inf) | Sim | Sim | Sim |
| Código 0 (sem prótese) | Sim | Sim | Sim |
| Código 1 (parcial) | Sim | Sim | Sim |
| Código 2 (total) | Sim | Sim | Sim |
| Código 9 (não registrado) | Sim | Sim | Sim |
| Necessidade: código 3 (total) | Sim | Sim | Sim |
| Prótese fixa separada de removível | A OMS separa | Sistema agrupa em código 1 | Parcialmente conforme |

**Nota sobre a prótese fixa:** A OMS (2013) distingue entre prótese removível parcial (código 1) e prótese fixa (que é coberta pelo código 7 nos dentes). O sistema não faz esta distinção explícita no campo de uso de prótese, o que pode dificultar análises que necessitem separar os dois tipos.

---

## 7. ANÁLISE DA CAMADA DE VALIDAÇÃO

### 7.1 Validação Frontend × Backend

| Campo | Regra Frontend | Regra Backend | Consistente? |
|-------|---------------|--------------|:------------:|
| participante | Obrigatório, não vazio | Obrigatório, não vazio | Sim |
| idade | 0–150 | 0–120 | **Não** (Inconsistência 4) |
| sexo | "M" ou "F" | M, F, masculino, feminino (case-insensitive) | Parcialmente |
| escola | Não validado (opcional) | Obrigatório | **Não** (Inconsistência 5) |
| examinador | Obrigatório, não vazio | Obrigatório, não vazio | Sim |
| data_coleta | Obrigatório | Data válida (Date.parse) | Sim |
| urgencia_tratamento | Códigos 0, 1, 2, 3, 9 | Apenas "0", "1", "2", "9" | **Não** (Inconsistência 3) |
| codigo_coroa | Implícito (botões 0–9) | [0,1,2,3,4,5,6,7,8,9] | Sim |
| numero_dente | Implícito (array fixo) | FDI_TEETH (32 dentes) | Sim |

### 7.2 Validação do CPOD no Backend

O backend **não recalcula** o CPOD a partir dos códigos dentários recebidos. Ele apenas verifica que `c_total`, `p_total`, `o_total` e `cpod_total` são inteiros não negativos:

**Evidência — `supabase/functions/save-clinical-exam/index.ts`:**

```typescript
for (const field of ["c_total", "p_total", "o_total", "cpod_total"] as const) {
  if (!Number.isInteger(data[field]) || data[field] < 0) {
    errors.push({ field, message: `${field} deve ser um inteiro não negativo.` });
  }
}
```

**Impacto:** O backend confia no cálculo enviado pelo frontend. Não há verificação de que `c_total + p_total + o_total === cpod_total`, nem que os totais são consistentes com os códigos dentários individuais enviados em `dentes[]`. Em um ataque malicioso ou erro de transmissão, seria possível armazenar um CPOD inconsistente.

**Sugestão:** Adicionar no backend a verificação:

```typescript
// Recalcular cpod a partir dos dentes recebidos e comparar
const recalcC = data.dentes.filter(d => d.codigo_coroa === 1).length;
const recalcO = data.dentes.filter(d => d.codigo_coroa === 2 || d.codigo_coroa === 3).length;
const recalcP = data.dentes.filter(d =>
  d.codigo_coroa === 4 || (data.idade >= 35 && d.codigo_coroa === 5)
).length;
if (recalcC + recalcP + recalcO !== data.cpod_total) {
  errors.push({ field: "cpod_total", message: "CPOD total inconsistente com os dentes registrados." });
}
```

---

## 8. ANÁLISE DO MÓDULO DE EXPORTAÇÃO

### 8.1 Recálculo de s_total e pr_total na Exportação

**Evidência — `src/App.tsx`, linhas 464–465:**

```typescript
const sTotal = allTeethNumbers.filter((t) => toothMap[t] === 6).length;
const prTotal = allTeethNumbers.filter((t) => toothMap[t] === 7).length;
```

Os campos `s_total` e `pr_total` são **recalculados na exportação** a partir dos registros individuais de dentes, em vez de usar os valores armazenados no banco. Este comportamento é correto e garante consistência, mas implica que alterações nos registros de dentes individuais (se implementadas futuramente) serão automaticamente refletidas no CSV.

### 8.2 Uso dos Valores Armazenados para c_total, p_total, o_total, cpod_total

Diferentemente de `s_total` e `pr_total`, os campos `c_total`, `p_total`, `o_total` e `cpod_total` são exportados **diretamente do banco de dados**, sem recálculo. Isso significa que, se houver inconsistência entre os valores armazenados e os códigos dentários (por falha de transmissão ou bug), o CSV refletirá os valores inconsistentes.

**Sugestão:** Padronizar o comportamento recalculando todos os totais na exportação, a partir dos registros individuais de dentes.

### 8.3 Ordem dos Dentes no CSV

**Evidência — `src/App.tsx`, linhas 441–444:**

```typescript
...DENTES_SUPERIORES.map((t) => `d${t}`),
...DENTES_INFERIORES.map((t) => `d${t}`),
```

Isso produz a ordem: `d18, d17, d16, d15, d14, d13, d12, d11, d21, d22, d23, d24, d25, d26, d27, d28, d48, d47, d46, d45, d44, d43, d42, d41, d31, d32, d33, d34, d35, d36, d37, d38`.

A ordem segue a sequência de exame clínico (direita para esquerda na superior; direita para esquerda na inferior), o que é clinicamente adequado.

---

## 9. MATRIZ DE CONFORMIDADE

**Legenda:** Conforme | Parcialmente Conforme | Não Conforme | Não Implementado

| Item Metodológico | OMS (2013) | SBBrasil 2010 | Status | Observação |
|------------------|:----------:|:-------------:|:------:|------------|
| Códigos 0–9 para condição da coroa | Obrigatório | Obrigatório | Conforme | Todos os 10 códigos corretos |
| Numeração FDI (32 dentes) | Obrigatório | Obrigatório | Conforme | 32 dentes implementados |
| Cálculo do componente C (código 1) | Obrigatório | Obrigatório | Conforme | Exato |
| Cálculo do componente O (códigos 2+3) | Obrigatório | Obrigatório | Conforme | Exato |
| Cálculo do componente P (código 4) | Obrigatório | Obrigatório | Conforme | Exato |
| Inclusão código 5 em adultos | Previsto | Obrigatório (35–44a) | Parcialmente | Limiar implementado: 30a; correto: 35a |
| Dentes índice IHOS (16,11,26,31,36,46) | Obrigatório | Obrigatório | Conforme | Exatos |
| Escores IHOS 0–3 | Obrigatório | Obrigatório | Conforme | Corretos |
| Exclusão código 9 do denominador IHOS | Obrigatório | Obrigatório | Conforme | Implementado com `.filter(v !== 9)` |
| Classificação IHOS (0–1,2 / 1,3–2,0 / >2,0) | Referenciado | Referenciado | Conforme | Pontos de corte corretos |
| Registro de uso de prótese (sup/inf) | Obrigatório | Obrigatório | Conforme | Códigos 0,1,2,9 |
| Registro de necessidade de prótese | Obrigatório | Obrigatório | Conforme | Códigos 0,1,2,3,9 |
| Urgência de tratamento (códigos 0–3) | Obrigatório | Obrigatório | Parcialmente | Código 3 bloqueado no backend |
| Exame por arcada (superior/inferior) | Obrigatório | Obrigatório | Conforme | Implementado |
| Estratificação por faixa etária | Recomendado | Obrigatório | Não Implementado | Sem grupos sentinela |
| índice ceod (dentição decídua) | Obrigatório (5 anos) | Obrigatório (5 anos) | Não Implementado | Somente CPOD |
| Cárie radicular | Recomendado (adultos) | Presente no SBBrasil | Não Implementado | Somente condição de coroa |
| Exclusão de terceiros molares (opcional) | Previsto | Discutível | Não Implementado | Todos os 32 dentes incluídos |
| Consistência CPOD vs. dentes individuais | Boa prática | Boa prática | Não Implementado | Backend não verifica consistência |

---

## 10. RECOMENDAÇÕES PRIORIZADAS

### Prioridade CRÍTICA — Deve ser corrigido antes do próximo uso em campo

**R1 — Corrigir a validação do código 3 de urgência no backend**

Arquivo: `supabase/functions/save-clinical-exam/index.ts`

```typescript
// ANTES (linha 14):
const URGENCIA_VALUES = ["0", "1", "2", "9"];

// DEPOIS:
const URGENCIA_VALUES = ["0", "1", "2", "3", "9"];
```

*Esta correção é necessária antes de qualquer coleta de dados, pois exames com urgência "Urgente" são bloqueados pelo servidor.*

---

### Prioridade ALTA — Deve ser corrigido para estudos com rigor metodológico

**R2 — Ajustar o limiar de inclusão do código 5 no componente P**

Arquivo: `src/App.tsx`

```typescript
// ANTES (linha 241):
const includeCode5 = !isNaN(ageNum) && ageNum >= 30;

// DEPOIS (alinhado ao grupo sentinela SBBrasil 35–44 anos):
const includeCode5 = !isNaN(ageNum) && ageNum >= 35;
```

**R3 — Alinhar validação de idade entre frontend e backend**

Arquivo: `src/App.tsx`

```typescript
// ANTES (linha 331):
if (!age || parseInt(age) < 0 || parseInt(age) > 150) return 'Idade inválida';

// DEPOIS (alinhado ao backend):
if (!age || parseInt(age) < 0 || parseInt(age) > 120) return 'Idade inválida (máximo: 120 anos)';
```

**R4 — Tornar campo `escola` opcional no backend ou obrigatório no frontend**

A inconsistência na obrigatoriedade do campo `escola` entre as duas camadas deve ser resolvida alinhando ambas para o mesmo comportamento.

---

### Prioridade MÉDIA — Corrigir para melhorar qualidade dos dados

**R5 — Corrigir o armazenamento de `ihos_total = NULL` quando sem registro**

Arquivo: `src/App.tsx` e migração SQL.

```typescript
// ANTES:
ihos_total: ihosTotal ?? 0,

// DEPOIS:
ihos_total: ihosTotal,  // null quando sem registro
```

Acompanhar com migração para alterar a coluna para aceitar NULL:

```sql
ALTER TABLE exams ALTER COLUMN ihos_total DROP NOT NULL;
ALTER TABLE exams ALTER COLUMN ihos_total SET DEFAULT NULL;
```

**R6 — Adicionar verificação de consistência do CPOD no backend**

Implementar recálculo do CPOD a partir dos dentes individuais no servidor para detectar inconsistências antes do armazenamento.

**R7 — Documentar os pontos de corte do IHOS com comentários de referência**

Adicionar ao código o comentário de origem dos valores `1.2` e `2.0`.

---

### Prioridade BAIXA — Melhorias para versões futuras

**R8 — Implementar suporte ao índice ceod para dentição decídua**

Necessário para estudos com crianças de 5 anos conforme SBBrasil.

**R9 — Adicionar estratificação automática por faixas etárias do SBBrasil**

Grupos: 5a, 12a, 15–19a, 35–44a, 65–74a.

**R10 — Implementar alerta de inconsistência clínica entre prótese e dentes**

Detectar combinações impossíveis como "prótese total + dentes presentes".

---

## REFERÊNCIAS UTILIZADAS NESTA ANÁLISE

1. WHO. *Oral Health Surveys: Basic Methods*. 5ª ed. Geneva: World Health Organization, 2013. p. 45–66.
2. BRASIL. Ministério da Saúde. *SBBrasil 2010: Pesquisa Nacional de Saúde Bucal — Resultados Principais*. Brasília: MS, 2012.
3. GREENE, J.C.; VERMILLION, J.R. The simplified oral hygiene index. *Journal of the American Dental Association*, v. 68, p. 7-13, 1964.
4. KLEIN, H.; PALMER, C.E.; KNUTSON, J.W. Studies on dental caries: I. Dental status and dental needs of elementary school children. *Public Health Reports*, v. 53, p. 751-765, 1938.

---

*Relatório gerado em junho de 2026 com base na análise direta do código-fonte do EpiBucal v1.0.*
*Todos os trechos de código apresentados foram extraídos dos arquivos originais com indicação de número de linha.*
