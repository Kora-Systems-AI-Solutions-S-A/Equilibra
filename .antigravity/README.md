# Antigravity AI Layer

Este diretório define a **camada de engenharia assistida por IA** utilizada no projeto.

Ele contém **Agents** e **Skills** que orientam ferramentas de IA (como Antigravity, Gemini ou Copilot) a gerar código consistente com a arquitetura do sistema.

A estrutura separa:

- regras **genéricas reutilizáveis**
- regras **específicas do projeto**

Isso permite reutilizar esta camada em múltiplos projetos mantendo **consistência arquitetural, previsibilidade e qualidade de código**.

---

# Estrutura


.antigravity
│
├─ agents
│ Agents genéricos reutilizáveis entre projetos
│
├─ skills
│ Capacidades técnicas reutilizáveis utilizadas pelos agents
│
├─ projects
│ Configurações específicas de cada projeto
│
└─ README.md
Documentação da camada de automação


---

# Agents

Agents representam **papéis especializados de engenharia de software**.

Eles orientam ferramentas de IA a decidir **como implementar mudanças**, respeitando a arquitetura existente.

Agents **não implementam regras isoladamente** — eles utilizam as *skills* disponíveis para avaliar cenários e propor soluções.

Principais agents disponíveis:

---

## architect-agent

Responsável por decisões estruturais.

Analisa:

- onde novas funcionalidades devem ser implementadas
- em qual camada da arquitetura o código deve viver
- consistência estrutural do projeto
- acoplamento entre módulos
- separação de responsabilidades

Evita alterações arquiteturais desnecessárias.

---

## frontend-agent

Especializado na camada de interface.

Responsável por:

- implementação de UI
- organização de componentes
- composição segura de interface
- respeito ao design system
- consistência visual
- integração com state management

---

## data-agent

Especializado em **fluxo de dados e persistência**.

Responsável por:

- integração com APIs
- modelagem de dados
- separação entre UI e camada de dados
- consistência do fluxo de dados
- validação de queries e segurança

---

## refactor-agent

Responsável por **melhoria estrutural de código existente**.

Atua em:

- remoção de duplicações
- simplificação de lógica
- melhoria de legibilidade
- reorganização segura de código

Sem alterar comportamento funcional.

---

## ux-reviewer-agent

Responsável por avaliar **qualidade da experiência do usuário**.

Analisa:

- consistência visual
- hierarquia de informação
- responsividade
- animações e transições
- clareza de interação

---

# Skills

Skills representam **capacidades técnicas reutilizáveis**.

Agents utilizam skills para aplicar regras específicas durante análises ou implementações.

Cada skill representa um **conjunto de critérios técnicos** que podem ser utilizados em diferentes cenários.

---

## architecture-placement

Define a camada correta para implementação de novas funcionalidades.

Evita:

- lógica em camadas incorretas
- mistura entre UI e regras de negócio
- acoplamento indevido entre módulos

---

## safe-ui-composition

Define boas práticas para composição de componentes UI.

Garante:

- componentes reutilizáveis
- separação entre layout e lógica
- estrutura previsível de componentes

---

## data-flow-segregation

Define a separação correta entre:

- UI
- state management
- services
- camada de dados

Evita mistura de responsabilidades entre camadas.

---

## responsive-review

Avalia comportamento responsivo da aplicação em diferentes tamanhos de ecrã.

Garante consistência visual e legibilidade.

---

## motion-review

Analisa animações e transições da interface.

Verifica:

- consistência de movimento
- impacto de performance
- qualidade da experiência visual

---

## security-boundary-review

Revisa limites de segurança da aplicação.

Evita:

- exposição de dados sensíveis
- queries inseguras
- confiança indevida em dados externos

---

## import-naming-consistency

Garante consistência de:

- alias de imports
- naming conventions
- organização de módulos

Ajuda a manter o código previsível e fácil de navegar.

---

# Projects

Cada projeto pode definir **configurações específicas**.

## Estrutura típica


projects/
equilibra/


Dentro dessa pasta ficam:

- contexto do projeto
- regras arquiteturais específicas
- agents especializados
- skills específicas do domínio

Essa separação permite que o sistema seja reutilizado em múltiplos projetos.

---

# Agent Responsibilities

Agents devem:

- respeitar a arquitetura existente
- preferir mudanças incrementais
- evitar alterações estruturais desnecessárias
- manter separação clara de responsabilidades

Agents **não devem alterar a arquitetura do projeto sem pedido explícito**.

Mudanças estruturais devem ocorrer apenas quando solicitadas diretamente.

---

# AI Loading Order

Quando uma ferramenta de IA estiver a trabalhar neste repositório, o processo recomendado é:

1. Ler este README
2. Carregar **agents genéricos**
3. Carregar **skills relevantes**
4. Identificar o projeto ativo dentro de `/projects`
5. Carregar os arquivos do projeto:
   - `project-context.md`
   - `project-rules.md`
   - `brain-map.md`
6. Aplicar as regras antes de gerar código

Essa ordem garante que a IA compreenda primeiro:

1. papéis de engenharia
2. capacidades técnicas
3. contexto específico do projeto

---

# Filosofia

Esta camada existe para garantir:

- arquitetura consistente
- código previsível
- separação clara de responsabilidades
- facilidade de evolução do projeto
- colaboração segura entre humanos e IA

O objetivo é que ferramentas de IA **atuem como engenheiros auxiliares**, respeitando o design do sistema em vez de introduzir soluções arbitrárias.