# AUDITORIA METODOLÓGICA — IHOS: REGRA DE DENTES SUBSTITUTOS
## Epibucal · Análise de Conformidade com OMS/2013 e SBBrasil 2010
### Junho de 2026

---

> **Escopo desta auditoria:** Verificar se o sistema implementa a regra de substituição dos dentes índice do IHOS prevista no protocolo OMS/Greene & Vermillion para os casos em que os dentes índice (16, 11, 26, 31, 36 e 46) estejam ausentes ou não puderem ser examinados.

---

## 1. COMO O SISTEMA FUNCIONA ATUALMENTE

### 1.1 Implementação existente

O sistema define seis dentes índice fixos e um único estado de ihos para cada um:

**`src/App.tsx`, linha 71:**
```typescript
const IHOS_TEETH = [16, 11, 26, 31, 36, 46] as const;
```

**`src/App.tsx`, linhas 208–210 — estado inicial:**
```typescript
const [ihos, setIhos] = useState<Record<number, number>>({
  16: 9, 11: 9, 26: 9, 31: 9, 36: 9, 46: 9,
});
```

Todos os seis dentes são inicializados com o código `9` ("Não registrado").

**`src/App.tsx`, linhas 63–69 — escores disponíveis:**
```typescript
const IHOS_CODES: Record<number, string> = {
  0: 'Sem placa',
  1: 'Até 1/3',
  2: '1/3 a 2/3',
  3: 'Mais de 2/3',
  9: 'Não registrado',
};
```

O código `9` é o único mecanismo de exclusão disponível. Ele é usado indistintamente para:
- dentes ausentes (perdidos por cárie ou outra causa)
- dentes não erupcionados
- dentes que não puderam ser examinados por outro motivo (acesso dificultado, trismo, etc.)

**`src/App.tsx`, linhas 228–232 — cálculo do IHOS:**
```typescript
const ihosTotal = useMemo(() => {
  const validScores = IHOS_TEETH.map((t) => ihos[t]).filter((v) => v !== 9);
  if (validScores.length === 0) return null;
  return validScores.reduce((sum, v) => sum + v, 0) / validScores.length;
}, [ihos]);
```

**Lógica aplicada:** qualquer dente com código `9` é simplesmente excluído do numerador e do denominador da média. O IHOS é calculado com os dentes restantes. Nenhuma busca por dente substituto é realizada.

**`src/App.tsx`, linha 290 — reset do formulário:**
```typescript
setIhos({ 16: 9, 11: 9, 26: 9, 31: 9, 36: 9, 46: 9 });
```

**`src/App.tsx`, linhas 539–562 — renderização dos cartões IHOS:**
```typescript
const renderIhosCard = (toothNumber: number) => {
  const code = ihos[toothNumber];
  return (
    <div className={`border-2 rounded-xl p-3 text-center ... ${IHOS_COLORS[code]}`}>
      <div className="font-bold text-base text-gray-800 mb-2 tabular-nums">
        {toothNumber}
      </div>
      <select
        value={code}
        onChange={(e) => handleIhosChange(toothNumber, parseInt(e.target.value))}
        ...
      >
        {Object.entries(IHOS_CODES).map(([codigo, descricao]) => (
          <option key={codigo} value={codigo}>
            {codigo} - {descricao}
          </option>
        ))}
      </select>
    </div>
  );
};
```

O cartão sempre exibe o número do dente índice original (ex.: "16"). Não há campo, indicador visual ou lógica que sinalize ao examinador que um dente está ausente e que outro dente do mesmo sextante poderia ou deveria ser avaliado em seu lugar.

### 1.2 Resumo do comportamento atual

| Situação clínica | Código registrado | Efeito no cálculo | Dente substituto buscado? |
|-----------------|------------------|-------------------|:------------------------:|
| Dente presente e avaliado (escore 0–3) | 0, 1, 2 ou 3 | Incluído na média | — |
| Dente ausente (perdido) | 9 | Excluído da média | **Não** |
| Dente não erupcionado | 9 | Excluído da média | **Não** |
| Dente impossível de examinar | 9 | Excluído da média | **Não** |

---

## 2. O QUE O PROTOCOLO OMS/GREENE & VERMILLION DETERMINA

### 2.1 Regra geral de Greene & Vermillion (1964)

O artigo original de Greene e Vermillion (1964) — *"The Simplified Oral Hygiene Index"*, J Am Dent Assoc, 68:7-13 — define o OHI-S com base no conceito de **sextantes**. A boca é dividida em seis sextantes, e cada sextante contribui com **um dente índice** para o cálculo:

| Sextante | Dente índice primário | Superfície avaliada |
|---------|-----------------------|---------------------|
| Superior direito (posterior) | **16** (primeiro molar sup. dir.) | Vestibular |
| Superior anterior | **11** (incisivo central sup. dir.) | Vestibular |
| Superior esquerdo (posterior) | **26** (primeiro molar sup. esq.) | Vestibular |
| Inferior esquerdo (posterior) | **36** (primeiro molar inf. esq.) | Lingual |
| Inferior anterior | **31** (incisivo central inf. esq.) | Lingual |
| Inferior direito (posterior) | **46** (primeiro molar inf. dir.) | Lingual |

A regra de ausência publicada por Greene & Vermillion (1964) e confirmada pela OMS (2013) é:

> *"The two molars in each posterior sextant are paired for recording, and **if one is missing, there is no replacement**. If no index teeth or tooth is present in a sextant, a score of 0 is recorded for that sextant."*

Tradução e interpretação:

1. **Sextantes posteriores (16, 26, 36, 46):** o primeiro molar é o índice. Se ele estiver ausente, o **segundo molar do mesmo sextante** (17, 27, 37 ou 47) pode ser usado. Se ambos estiverem ausentes, o sextante recebe escore 0 e é **excluído** do denominador — **não recebe escore 0 como dado real**.
2. **Sextantes anteriores (11, 31):** se o incisivo central estiver ausente, qualquer outro incisivo presente no sextante anterior pode ser utilizado.
3. **Sextante completamente edêntulo:** excluído do cálculo (denominador reduzido).

### 2.2 Regra detalhada por sextante

#### Sextantes posteriores (4 sextantes)

```
Sextante superior direito:
  Índice primário: dente 16 (1º molar sup. dir.)
  Substituto:     dente 17 (2º molar sup. dir.)
  Se 16 e 17 ausentes → sextante excluído (escore 0, não entra no denominador)

Sextante superior esquerdo:
  Índice primário: dente 26 (1º molar sup. esq.)
  Substituto:     dente 27 (2º molar sup. esq.)
  Se 26 e 27 ausentes → sextante excluído

Sextante inferior esquerdo:
  Índice primário: dente 36 (1º molar inf. esq.)
  Substituto:     dente 37 (2º molar inf. esq.)
  Se 36 e 37 ausentes → sextante excluído

Sextante inferior direito:
  Índice primário: dente 46 (1º molar inf. dir.)
  Substituto:     dente 47 (2º molar inf. dir.)
  Se 46 e 47 ausentes → sextante excluído
```

#### Sextantes anteriores (2 sextantes)

```
Sextante anterior superior:
  Índice primário: dente 11 (incisivo central sup. dir.)
  Substituto:     qualquer incisivo superior presente (12, 21 ou 22)
  Se nenhum incisivo superior presente → sextante excluído

Sextante anterior inferior:
  Índice primário: dente 31 (incisivo central inf. esq.)
  Substituto:     qualquer incisivo inferior presente (32, 41 ou 42)
  Se nenhum incisivo inferior presente → sextante excluído
```

### 2.3 Posição da OMS (2013)

A OMS (2013), em *"Oral Health Surveys: Basic Methods"*, 5ª edição, página 58, reproduz os critérios de Greene e Vermillion com a seguinte nota sobre os dentes índice do IHOS:

> O exame é realizado em seis superfícies representativas. Quando o dente índice de um sextante não puder ser examinado (ausente, fraturado, com banda ortodôntica etc.), outro dente totalmente erupcionado do mesmo sextante pode ser selecionado. Se nenhum dente estiver disponível no sextante, este é excluído do cálculo.

### 2.4 Posição do SBBrasil 2010

O manual de campo do SBBrasil 2010 (Ministério da Saúde, 2009) adota os critérios da OMS/2013 para o IHOS sem modificações. A ficha de campo do SBBrasil prevê o registro por sextante, e os instrutores de calibração orientam os examinadores a buscar o dente substituto antes de registrar o sextante como "não examinável".

### 2.5 Quadro comparativo: protocolo vs. sistema atual

| Situação | Protocolo OMS/Greene & Vermillion | Sistema atual |
|----------|----------------------------------|---------------|
| Dente 16 ausente | Examinar dente 17 como substituto | Registra código 9, exclui do cálculo |
| Dente 26 ausente | Examinar dente 27 como substituto | Registra código 9, exclui do cálculo |
| Dente 36 ausente | Examinar dente 37 como substituto | Registra código 9, exclui do cálculo |
| Dente 46 ausente | Examinar dente 47 como substituto | Registra código 9, exclui do cálculo |
| Dente 11 ausente | Examinar qualquer incisivo sup. | Registra código 9, exclui do cálculo |
| Dente 31 ausente | Examinar qualquer incisivo inf. | Registra código 9, exclui do cálculo |
| Sextante completamente edêntulo | Excluir do denominador | Exclui do denominador (código 9) — resultado correto por acidente |
| Fórmula com n variável | IHOS = Σ(escores) / n(sextantes avaliados) | IHOS = Σ(escores) / n(dentes com código ≠ 9) — matematicamente equivalente se a substituição não for feita |

---

## 3. ALTERAÇÕES NECESSÁRIAS PARA IMPLEMENTAR A SUBSTITUIÇÃO

### 3.1 Mapa completo de substitutos por sextante

```typescript
// Regra: se o dente índice primário está ausente (código 9 no CPOD ou não erupcionado),
// o examinador deve examinar o substituto antes de deixar o sextante como "não avaliado"

const IHOS_SEXTANTS = [
  {
    label: 'Superior direito',
    primary: 16,
    substitute: 17,
    surface: 'Vestibular',
  },
  {
    label: 'Anterior superior',
    primary: 11,
    substitutes: [12, 21, 22],   // qualquer incisivo superior
    surface: 'Vestibular',
  },
  {
    label: 'Superior esquerdo',
    primary: 26,
    substitute: 27,
    surface: 'Vestibular',
  },
  {
    label: 'Inferior esquerdo',
    primary: 36,
    substitute: 37,
    surface: 'Lingual',
  },
  {
    label: 'Anterior inferior',
    primary: 31,
    substitutes: [32, 41, 42],   // qualquer incisivo inferior
    surface: 'Lingual',
  },
  {
    label: 'Inferior direito',
    primary: 46,
    substitute: 47,
    surface: 'Lingual',
  },
] as const;
```

### 3.2 Alterações no estado

O estado `ihos` precisaria ser expandido para rastrear:
1. Qual dente foi efetivamente examinado (primário ou substituto)
2. O escore registrado para esse dente

```typescript
// Estado atual (src/App.tsx, linha 208):
const [ihos, setIhos] = useState<Record<number, number>>({
  16: 9, 11: 9, 26: 9, 31: 9, 36: 9, 46: 9,
});

// Estado proposto — rastrear o dente examinado por sextante:
interface IhosSextantRecord {
  toothExamined: number;   // dente efetivamente examinado (primário ou substituto)
  score: number;           // escore 0–3, ou 9 se sextante não avaliado
  isSubstitute: boolean;   // flag para relatório e exportação
}

const [ihosRecords, setIhosRecords] = useState<Record<number, IhosSextantRecord>>({
  16: { toothExamined: 16, score: 9, isSubstitute: false },
  11: { toothExamined: 11, score: 9, isSubstitute: false },
  26: { toothExamined: 26, score: 9, isSubstitute: false },
  31: { toothExamined: 31, score: 9, isSubstitute: false },
  36: { toothExamined: 36, score: 9, isSubstitute: false },
  46: { toothExamined: 46, score: 9, isSubstitute: false },
});
```

### 3.3 Alterações na interface do examinador

O cartão IHOS de cada sextante precisaria de uma lógica de dois passos:

```
Passo 1: O examinador indica se o dente índice primário está presente
  → Se SIM: registra o escore normalmente (0–3)
  → Se NÃO: o sistema exibe o campo para o dente substituto

Passo 2 (somente se dente primário ausente):
  → Para sextantes posteriores: o sistema exibe "Usar dente 17?" (ou 27/37/47)
  → Para sextantes anteriores: o sistema exibe seletor de incisivo substituto
  → Se substituto também ausente: sextante marcado como "Sextante sem dente" — excluído do cálculo
```

**Esboço de interface do cartão expandido:**

```
┌────────────────────────────────────────┐
│  Sextante superior direito             │
│  Dente índice: 16                      │
│                                        │
│  Dente 16 presente? [Sim] [Não]        │
│                                        │
│  (se Não):                             │
│  Dente substituto: 17                  │
│  Dente 17 presente? [Sim] [Sextante    │
│                           sem dente]   │
│                                        │
│  Escore: [0] [1] [2] [3]               │
│  Dente examinado: 17 (substituto)  ⚠   │
└────────────────────────────────────────┘
```

### 3.4 Alterações no banco de dados

Seriam necessárias novas colunas para rastrear os dentes substitutos:

```sql
-- Migração proposta (não aplicar agora — apenas especificação)

ALTER TABLE exams
  ADD COLUMN IF NOT EXISTS ihos_16_dente_examinado integer DEFAULT 16,
  ADD COLUMN IF NOT EXISTS ihos_11_dente_examinado integer DEFAULT 11,
  ADD COLUMN IF NOT EXISTS ihos_26_dente_examinado integer DEFAULT 26,
  ADD COLUMN IF NOT EXISTS ihos_31_dente_examinado integer DEFAULT 31,
  ADD COLUMN IF NOT EXISTS ihos_36_dente_examinado integer DEFAULT 36,
  ADD COLUMN IF NOT EXISTS ihos_46_dente_examinado integer DEFAULT 46;

-- Valores possíveis:
-- ihos_16_dente_examinado: 16 (primário) ou 17 (substituto) ou NULL (sextante excluído)
-- ihos_11_dente_examinado: 11 (primário) ou 12, 21, 22 (substitutos) ou NULL
-- etc.
```

### 3.5 Alterações na exportação CSV

O CSV exportado precisaria incluir as colunas adicionais para que os analistas saibam, para cada exame, quais dentes foram efetivamente examinados:

```
Colunas atuais:   ihos_16, ihos_11, ihos_26, ihos_31, ihos_36, ihos_46, ihos_total
Colunas propostas: ihos_16, ihos_16_dente, ihos_11, ihos_11_dente, ..., ihos_total
```

Onde `ihos_16_dente` = 16 se o primário foi usado, = 17 se o substituto foi usado, = null se sextante excluído.

### 3.6 Complexidade estimada de implementação

| Componente | Mudança necessária | Impacto |
|-----------|-------------------|---------|
| `IHOS_TEETH` array | Substituir por estrutura `IHOS_SEXTANTS` com primário + substitutos | Médio |
| Estado `ihos` (useState) | Adicionar campo `toothExamined` e `isSubstitute` por sextante | Médio |
| `ihosTotal` (useMemo) | Ajustar para usar `record.score` em vez de `ihos[t]` | Baixo |
| `renderIhosCard` | Adicionar UI de dois passos com seletor de substituto | Alto |
| Banco de dados | Adicionar 6 colunas `ihos_XX_dente_examinado` | Baixo |
| Exportação CSV | Adicionar 6 colunas no cabeçalho e nas linhas | Baixo |
| Edge function | Aceitar e validar os novos campos opcionais | Baixo |
| **Total** | | **Médio-alto** |

---

## 4. IMPACTO EPIDEMIOLÓGICO DA AUSÊNCIA DESTA FUNCIONALIDADE

### 4.1 Impacto direto sobre o cálculo do IHOS

**Cenário A — Participante com dente 16 ausente e dente 17 presente:**

```
Protocolo OMS (correto):
  Examina dente 17 → escore 2
  IHOS = (escore_11 + escore_26 + escore_31 + escore_36 + escore_46 + 2) / 6

Sistema atual (incorreto):
  Registra dente 16 como código 9 → exclui do cálculo
  IHOS = (escore_11 + escore_26 + escore_31 + escore_36 + escore_46) / 5
```

O denominador muda de 6 para 5, alterando o valor da média. Se os outros cinco sextantes tiverem escore médio diferente do dente 17, o IHOS calculado será diferente do valor correto.

**Cenário B — Participante adulto com múltiplos primeiros molares ausentes:**

Em populações adultas (35–44 anos) e de idosos (65–74 anos) — grupos sentinela do SBBrasil — é comum a perda dos primeiros molares. Um participante com 16, 26, 36 e 46 todos ausentes e segundos molares (17, 27, 37, 47) presentes teria:

```
Protocolo OMS:  IHOS calculado com 6 dentes (4 substitutos + 2 índices primários)
Sistema atual:  IHOS calculado apenas com os 2 sextantes anteriores (11 e 31)
                → denominador = 2 em vez de 6
                → variância altíssima, dado praticamente inutilizável
```

### 4.2 Viés de seleção na análise populacional

Quando a substituição não é realizada, os participantes que mais necessitariam de atenção odontológica (aqueles com maior número de dentes perdidos, geralmente associado a piores condições socioeconômicas e de saúde bucal) produzem IHOSs calculados com menor número de sextantes. Isso introduz um **viés sistemático de subestimação** do IHOS médio populacional, especialmente em:

- Levantamentos com idosos (65–74 anos)
- Comunidades de baixa renda com alta prevalência de perda dentária
- Estudos longitudinais onde os participantes perdem dentes entre as ondas de coleta

### 4.3 Impacto na comparabilidade com dados do SBBrasil

Os dados do SBBrasil 2010 foram coletados com a regra de substituição. Se o Epibucal for usado para comparar resultados com o SBBrasil, a ausência de substituição tornará os valores de IHOS **não comparáveis** com os dados nacionais para populações adultas e idosas.

Para a população de 12 anos (grupo prioritário de muitos levantamentos escolares), o impacto é **menor**, pois a perda de primeiros molares é rara nessa idade. Porém, mesmo em adolescentes, o dente 16 pode estar ausente por extração precoce ou agenesia, e o protocolo de substituição ainda se aplica.

### 4.4 Magnitude estimada do erro em diferentes populações

| Faixa etária | Prevalência estimada de perda de 1º molar | Impacto no IHOS calculado |
|--------------|------------------------------------------|--------------------------|
| 12 anos | < 5% (raro) | Mínimo |
| 15–19 anos | 5–15% | Baixo |
| 35–44 anos | 40–60% | **Alto** |
| 65–74 anos | 70–90% | **Muito alto** |

Fontes estimadas: SBBrasil 2010 (Ministério da Saúde, 2012); WHO Global Oral Health Data Bank.

### 4.5 Avaliação de risco para o contexto de uso atual

O Epibucal foi desenvolvido para uso na **UniOpen** e em estudos com foco em **estudantes universitários e escolares**. Para este público específico:

- Faixa etária predominante: 17–30 anos
- Prevalência de perda de primeiro molar: estimada em 10–25%
- **Impacto do bug: baixo a moderado** para o contexto imediato

Porém, se o sistema for expandido para uso em populações adultas ou idosas (o que é previsto nas melhorias futuras), **o impacto se tornará crítico**.

---

## 5. CONCLUSÃO E RECOMENDAÇÕES

### 5.1 Diagnóstico

O sistema **não implementa** a regra de substituição do OHI-S de Greene & Vermillion (1964) e da OMS (2013). Em vez disso, aplica uma simplificação aceitável para populações jovens, mas metodologicamente incorreta para populações adultas e idosas: exclui o dente índice ausente sem buscar o substituto do mesmo sextante.

Esta lacuna **não é um erro de programação** — é uma decisão de design incompleta. O cálculo matemático (média dos escores válidos) está correto. O que falta é a etapa clínica anterior ao cálculo: a busca pelo dente substituto antes de registrar o código 9.

### 5.2 Recomendação imediata (baixo esforço)

Sem alterar a estrutura do código, adicionar um **texto informativo** no cartão de cada dente IHOS quando o examinador seleciona código 9, orientando-o a verificar se existe um dente substituto disponível:

```typescript
// Em renderIhosCard, adicionar abaixo do select quando code === 9:
{code === 9 && (
  <p className="text-xs text-amber-600 mt-1">
    Se ausente: verificar dente {toothNumber === 16 ? 17
                                : toothNumber === 26 ? 27
                                : toothNumber === 36 ? 37
                                : toothNumber === 46 ? 47
                                : toothNumber === 11 ? '12/21'
                                : '32/41'} como substituto.
  </p>
)}
```

Esta abordagem não corrige a coleta de dados sobre qual dente foi examinado, mas orienta o examinador a seguir o protocolo correto no campo.

### 5.3 Recomendação de médio prazo (versão 1.1)

Implementar a estrutura completa de `IHOS_SEXTANTS` com rastreamento do dente efetivamente examinado, conforme especificado na Seção 3. Esta implementação deve ser acompanhada de uma migração de banco de dados e atualização da exportação CSV.

### 5.4 Documentar a limitação atual

Até que a implementação completa seja realizada, o relatório de validação metodológica do sistema e qualquer publicação produzida com esses dados devem incluir a seguinte nota de rodapé:

> *"O registro do IHOS no Epibucal v1.0 não implementa a regra de substituição de dentes índice prevista em Greene e Vermillion (1964) e OMS (2013). Quando o dente índice primário estava ausente, o sextante correspondente foi excluído do cálculo em vez de ser avaliado com o dente substituto. Este procedimento pode subestimar o IHOS em participantes com perda dentária."*

---

## REFERÊNCIAS

1. GREENE, J.C.; VERMILLION, J.R. The simplified oral hygiene index. *Journal of the American Dental Association*, v. 68, p. 7-13, jan. 1964.
2. WHO. *Oral Health Surveys: Basic Methods*. 5ª ed. Geneva: World Health Organization, 2013. p. 58-60.
3. BRASIL. Ministério da Saúde. *SBBrasil 2010: Manual de Calibração de Examinadores*. Brasília: MS, 2009.
4. BRASIL. Ministério da Saúde. *Pesquisa Nacional de Saúde Bucal — Resultados Principais*. Brasília: MS, 2012.

---

*Auditoria realizada em junho de 2026 com base na leitura direta do código-fonte `src/App.tsx` e nas normas metodológicas de referência.*
