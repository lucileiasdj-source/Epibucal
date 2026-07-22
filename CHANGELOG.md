# CHANGELOG — EpiBucal

Registro cronologico de todas as alteracoes realizadas no projeto EpiBucal (PROFSMOC II).
Formato baseado em Keep a Changelog (https://keepachangelog.com/pt-BR/1.1.0/).

---

## [1.4.0] - 2026-06-04

### Novas funcionalidades
- Aplicacao transformada em PWA (Progressive Web App) instalavel.
- Service Worker com cache offline para assets estaticos e paginas de navegacao.
- Banner de instalacao com evento `beforeinstallprompt` para Chrome Android e Samsung Internet.
- Botao "Instalar App" na barra de navegacao sticky, visivel enquanto o app nao estiver instalado.
- Deteccao automatica de modo standalone para ocultar elementos de instalacao quando ja instalado.

### Correcoes de bugs
- Corrigido `display` do manifest de `"browser"` para `"standalone"`.
- Adicionado campo `scope: "/"` ausente no manifest.
- Unificado `theme_color` para `#0f766e` entre manifest e meta tags HTML.
- Service Worker reescrito com suporte offline real (requisito do Chrome para instalacao).
- Corrigida captura do evento `beforeinstallprompt` — movida para nivel de modulo para evitar perda por timing de montagem do React.
- Removida exportacao duplicada em `InstallBanner.tsx` que impedia a compilacao.

### Melhorias de interface
- Animacao `slide-up` adicionada ao banner de instalacao.
- Meta tags Apple Web App adicionadas para compatibilidade iOS.
- Icones do manifest separados por `purpose` (`any` e `maskable`) conforme recomendacao do Lighthouse.

---

## [1.3.0] - 2026-05-29

### Novas funcionalidades
- Tabela `access_logs` criada para monitoramento anonimo de uso (sessoes, navegacao entre abas).
- Painel administrativo (`AdminPanel`) com visao geral de acessos, sessoes unicas, dispositivos e navegadores.
- Sistema de rastreamento de sessao via `sessionStorage` sem coleta de dados pessoais.
- Funcoes `logPageLoad` e `logTabNavigation` para registro de eventos.

### Melhorias de interface
- Componente `IhosSelect` reescrito com renderizacao via React Portal para evitar corte do dropdown.
- Dicas de dentes substitutos adicionadas ao dropdown IHOS (ex.: "Verificar dente 17 antes" para dente 16).

### Observacoes
- Rastreamento de acesso desabilitado apos testes iniciais para otimizar desempenho em dispositivos moveis de campo. Infraestrutura preservada para reativacao futura.

---

## [1.2.0] - 2026-05-25

### Alteracoes em banco de dados
- Todas as colunas renomeadas de ingles para portugues nas tabelas `exams` e `tooth_records`.
- Mapeamento: `participant_id` → `participante`, `age` → `idade`, `sex` → `sexo`, `school` → `escola`, `examiner` → `examinador`, `collection_date` → `data_coleta`, `tooth_number` → `numero_dente`, `crown_code` → `codigo_coroa`.
- Campos de protese e urgencia tambem renomeados (ex.: `upper_prosthesis_use` → `uso_protese_superior`).

### Melhorias
- CSV exportado com cabecalhos em portugues, eliminando necessidade de dicionario de traducao.

---

## [1.1.0] - 2026-05-22

### Novas funcionalidades
- Campos de protese adicionados: uso de protese superior/inferior, necessidade de protese superior/inferior.
- Campo de urgencia de tratamento com codigos OMS (0-3, 9).
- Seis campos IHOS adicionados (dentes 16, 11, 26, 31, 36, 46) com campo `ihos_total` calculado.
- Indices epidemiologicos persistidos no banco: `c_total`, `p_total`, `o_total`, `cpod_total`.

### Mudancas nos calculos epidemiologicos
- CPOD calculado em tempo real via `useMemo`:
  - C (Cariados): contagem de dentes com codigo 1.
  - P (Perdidos): contagem de dentes com codigo 4; inclui codigo 5 quando idade >= 30.
  - O (Obturados): contagem de dentes com codigos 2 e 3.
  - CPOD = C + P + O.
- IHOS Total: media dos scores validos (codigo 9 excluido da contagem).
- Classificacao IHOS: Boa (<=1.2), Regular (<=2.0), Necessita Melhoria (>2.0).

### Alteracoes em banco de dados
- Politicas RLS alteradas de `authenticated` para acesso publico anonimo.
- Politicas de DELETE removidas intencionalmente para proteger integridade dos dados.
- Campos `c_total`, `p_total`, `o_total`, `cpod_total` adicionados a tabela `exams`.

### Correcoes de bugs
- Exportacao CSV adaptada para compatibilidade com navegadores moveis Android.

---

## [1.0.0] - 2026-05-21

### Novas funcionalidades
- Formulario completo de exame clinico epidemiologico em saude bucal.
- Secoes: Identificacao do Participante, Condicao da Coroa Dentaria (32 dentes permanentes).
- Codigos de condicao dentaria conforme OMS: 0 (Higido) a 9 (Nao registrado).
- Sistema de cores por codigo para identificacao visual rapida.
- Navegacao por secoes com barra sticky e scroll suave.
- Validacao de formulario (campos obrigatorios, faixa de idade).
- Salvamento via Edge Function (`save-clinical-exam`) com validacao servidor.
- Exportacao completa em CSV com delimitador ponto-e-virgula.
- Funcao administrativa para exclusao de exames (`delete-all-exams`).
- Modais de confirmacao para acoes destrutivas.
- Notificacoes toast para feedback de sucesso e erro.
- Design responsivo mobile-first otimizado para tablets de campo.

### Alteracoes em banco de dados
- Tabela `exams` criada com campos de identificacao e metadados.
- Tabela `tooth_records` criada com FK para `exams` e cascade delete.
- RLS habilitado em ambas as tabelas.
- Indice criado em `tooth_records.exam_id`.

### Edge Functions
- `save-clinical-exam`: Validacao completa dos dados, insercao transacional com rollback manual, mensagens de erro em portugues.
- `delete-all-exams`: Exclusao administrativa com contagem de registros removidos.
