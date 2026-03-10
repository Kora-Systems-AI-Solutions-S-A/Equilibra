# Project Context — Equilibra

## Visão Geral

Equilibra é uma aplicação de **gestão financeira pessoal moderna**, focada em:

- clareza financeira
- organização de receitas e despesas
- gestão de dívidas
- acompanhamento de evolução financeira
- visualização de dados através de dashboards

A aplicação foi projetada com foco em:

- simplicidade de uso
- visual premium
- decisões financeiras conscientes

O objetivo é fornecer ao utilizador **controlo total da sua vida financeira num único lugar**.

---

# Stack Tecnológica

## Frontend

- React
- TypeScript
- Vite
- Zustand (state management)
- Framer Motion (animações)
- CSS modular
- Design system interno

---

## Backend (Planeado)

Inicialmente a aplicação utiliza **mocks locais e services internos**.

A próxima etapa será integração com:

Supabase

Supabase fornecerá:

- autenticação
- base de dados PostgreSQL
- Row Level Security (RLS)
- storage
- funções server-side
- API segura para persistência de dados financeiros

---

# Arquitetura da Aplicação

O projeto segue uma arquitetura baseada em:

**features + camadas separadas + infraestrutura centralizada**

Essa abordagem permite:

- modularidade
- baixo acoplamento
- evolução segura do código
- facilidade de manutenção

Estrutura principal do projeto:
src/
│
├─ assets/
│ Imagens e arquivos estáticos
│
├─ core/
│ Infraestrutura técnica da aplicação
│
│ ├─ api/
│ │ Cliente HTTP central e tratamento de erros
│ │
│ ├─ config/
│ │ Configurações globais da aplicação
│ │
│ └─ supabase/
│ Cliente e configuração da integração com Supabase
│
├─ features/
│ Módulos funcionais da aplicação
│
├─ helpers/
│ Funções utilitárias específicas da aplicação
│
├─ hooks/
│ Hooks reutilizáveis
│
├─ lib/
│ Utilidades de baixo nível
│
├─ mappers/
│ Conversão entre DTOs e modelos internos
│
├─ models/
│ Tipos e contratos de dados
│
├─ pages/
│ Páginas principais que orquestram as features
│
├─ services/
│ Camada responsável por acesso a dados e lógica de integração
│
├─ shared/
│ Componentes reutilizáveis e design system
│
├─ store/
│ Estado global da aplicação (Zustand)
└─

---

# Infraestrutura Core

A pasta `core` contém infraestrutura técnica reutilizável.

Essa camada centraliza integrações externas e evita dependência direta entre features e bibliotecas externas.

Exemplos de responsabilidades:

- cliente HTTP
- tratamento de erros
- configuração global
- cliente Supabase
- infraestrutura de comunicação com APIs

Isso garante que features permaneçam desacopladas da infraestrutura.

---

# Responsabilidades das Camadas

## features

Contém **módulos funcionais da aplicação**.

Cada feature agrupa componentes e lógica relacionada a uma funcionalidade específica.

Exemplos:

- auth
- dashboard
- investimentos
- planejamento de dívidas
- resumo mensal

Features podem conter:

- components
- modals
- forms
- sub-features

---

## pages

Define **páginas principais da aplicação**.

Exemplos:

- AuthPage
- DashboardPage

Pages são responsáveis por:

- composição de layout
- orquestração de features

Pages **não devem conter lógica de negócio**.

---

## shared

Contém **componentes reutilizáveis entre features**.

Estrutura atual inclui:

- layout
- ui components
- componentes base reutilizáveis

Exemplos:

- Button
- Drawer
- Modal
- Tooltip
- MoneyInput
- LoadingOverlay

Essa camada funciona como **design system interno da aplicação**.

---

## services

Responsável por:

- acesso a dados
- chamadas de API
- integração com Supabase
- comunicação com camada core/api

Services encapsulam regras de acesso a dados.

A UI **nunca acessa dados diretamente**.

---

## store

Gerencia estado global da aplicação usando **Zustand**.

Responsável por:

- estado de autenticação
- estado da interface
- loading global
- estado das features

Stores coordenam fluxo entre UI e services.

---

## hooks

Hooks reutilizáveis da aplicação.

Utilizados para encapsular lógica reutilizável.

---

## helpers

Funções utilitárias específicas da aplicação.

Podem incluir:

- cálculos financeiros
- transformações simples
- lógica utilitária local

---

## lib

Contém utilidades genéricas de baixo nível.

Exemplos:

- formatadores
- utilitários genéricos
- funções auxiliares independentes

---

## mappers

Responsável por converter entre:

- DTOs
- modelos internos
- formatos de API

---

## models

Definições de tipos e contratos de dados utilizados na aplicação.

---

# Fluxo de Dados

O fluxo correto de dados na aplicação é:

UI  
↓  
Feature Components  
↓  
Store  
↓  
Services  
↓  
Core API / Supabase Client  
↓  
Backend

A UI **nunca deve acessar diretamente APIs ou Supabase**.

---

# Autenticação

Autenticação será gerenciada por:

Supabase Auth

O frontend utilizará:

- sessões seguras
- tokens gerenciados automaticamente
- autenticação persistente
- acesso seguro às tabelas via RLS

---

# Segurança

Dados do utilizador **não devem ser expostos na UI ou em payloads inseguros**.

A aplicação deve garantir:

- isolamento de dados por utilizador
- queries filtradas por usuário autenticado
- nenhuma exposição de identificadores sensíveis
- proteção contra SQL injection
- proteção contra prompt injection em conteúdo dinâmico

---

# Camada Intermédia (Planeada)

Futuramente será adicionada uma camada intermédia entre:

Frontend  
e  
Supabase

Objetivo:

- remover regras de negócio do frontend
- centralizar lógica de dados
- permitir evolução futura da arquitetura
- facilitar validações e segurança

---

# Padrões de UI

A interface segue princípios de design:

- visual premium
- minimalismo
- consistência
- animações suaves

Cores principais da aplicação:

- grafite
- verde

Layout responsivo deve suportar:

- desktop
- tablet
- mobile

---

# Estrutura do Dashboard

O dashboard apresenta:

- planejamento de dívidas
- entradas de renda
- resumo mensal
- investimentos

Os componentes são organizados por feature dentro da pasta `features/dashboard`.

---

# Regras de Implementação

Agents devem respeitar as seguintes regras fundamentais:

1. Nunca alterar arquitetura sem pedido explícito
2. Não mover arquivos entre pastas sem autorização
3. Não duplicar componentes existentes
4. Não quebrar imports existentes
5. Não introduzir lógica de negócio na UI
6. Utilizar alias de imports

Alias padrão:
@/

Exemplo de import correto:
@/features/dashboard/components/InvestmentsCard


---

# Qualidade de Código

O código deve priorizar:

- legibilidade
- modularidade
- responsabilidade única
- baixo acoplamento
- reutilização de componentes

Refatorações devem preservar comportamento existente.

---

# Estado Atual do Projeto

O projeto atualmente possui:

- autenticação mockada
- dashboard funcional
- estrutura modular
- loading overlay global
- sidebar interativa
- design system inicial

---

# Próximas Etapas

1. Integração com Supabase
2. Persistência real de dados
3. PWA
4. onboarding do utilizador
5. melhorias de UX

---

# Objetivo do Sistema Antigravity

Os agents e skills existem para garantir que:

- novas funcionalidades respeitem a arquitetura
- o código permaneça organizado
- decisões técnicas sejam consistentes
- segurança seja preservada
- o projeto possa evoluir com estabilidade