# Equilibra — Brain Map

Este documento descreve o **mapa mental da aplicação Equilibra**.

Ele ajuda ferramentas de IA a compreender:

- estrutura do sistema
- domínios da aplicação
- fluxo de dados
- responsabilidades das camadas

Este documento **não substitui o project-context**, ele complementa com visão estrutural.

---

# Domínio da Aplicação

Equilibra é uma aplicação de **gestão financeira pessoal**.

O objetivo é permitir que o utilizador tenha **visão clara da sua situação financeira** e consiga tomar decisões financeiras conscientes.

Principais áreas do domínio:

- Planejamento de dívidas
- Registro de receitas
- Resumo financeiro mensal
- Gestão de investimentos

---

# Domínios Funcionais

A aplicação possui os seguintes domínios principais.

## Auth

Responsável por:

- autenticação do utilizador
- gestão de sessão
- proteção de rotas

Localização:


src/features/auth


---

## Dashboard

Responsável pela visão consolidada da situação financeira do utilizador.

Localização:


src/features/dashboard


O dashboard é composto por **cards independentes**, cada um representando um domínio financeiro.

Cards atuais:

- Debt Planning
- Income
- Monthly Summary
- Investments

Cada card representa **um domínio financeiro isolado**.

---

# Arquitetura da Aplicação

A aplicação segue uma arquitetura baseada em **features + camadas separadas**.

Estrutura principal:


src
│
├ core
│
├ features
│
├ pages
│
├ services
│
├ store
│
└ shared


Essa estrutura permite:

- isolamento de domínios
- separação clara de responsabilidades
- evolução incremental da aplicação

---

# Responsabilidade das Camadas

## UI (features / shared/ui)

Responsável por:

- apresentação
- interação
- layout

A UI **não deve conter lógica de negócio**.

A UI **não deve acessar APIs diretamente**.

---

## Store (Zustand)

Responsável por:

- coordenação de estado
- ações de feature
- comunicação com services

A store atua como **orquestrador da lógica de aplicação**.

---

## Services

Responsável por:

- acesso a dados
- comunicação com backend
- integração com APIs externas

Services **não devem conter lógica de UI**.

---

## Core

Responsável por:

- infraestrutura
- cliente HTTP
- integração com Supabase
- configurações globais

---

# Fluxo de Dados

Fluxo padrão da aplicação:


UI
↓
Feature Components
↓
Store (Zustand)
↓
Services
↓
Core (Supabase Client / HTTP)
↓
Database


Este fluxo **deve ser preservado**.

A UI **nunca deve acessar APIs ou Supabase diretamente**.

---

# Organização de Features

Cada feature é organizada por domínio funcional.

Exemplo:


features/dashboard

investimentos
planejamento-dividas
resumo-mensal


Dentro de cada domínio podem existir:

- components
- modals
- hooks específicos
- utilitários

Essa organização evita:

- componentes gigantes
- mistura de responsabilidades
- acoplamento entre domínios

---

# Design System

Componentes reutilizáveis vivem em:


src/shared/ui


Exemplos:

- Button
- ModalBase
- FloatingLabelInput
- MoneyInput
- DrawerBase

Esses componentes devem ser **agnósticos de domínio**.

---

# Motion e Interações

A aplicação utiliza:

- Framer Motion

Objetivos:

- animações suaves
- feedback visual claro
- sensação de interface premium

Motion deve ser **subtil e funcional**, nunca distrativo.

---

# State Management

A aplicação utiliza:

Zustand

Stores principais:

auth.store
debtPlans.store
investments.store
monthlyRecords.store
ui.store

Cada store representa **um domínio de estado da aplicação**.

---

# Integração com Backend

O backend planeado utiliza:

- Supabase
- PostgreSQL
- Row Level Security
- Supabase Auth

Responsabilidades:

- Services acessam Supabase
- Stores coordenam as chamadas
- UI consome apenas estado

A UI **não conhece Supabase diretamente**.

---

# Princípios Arquiteturais

A IA deve sempre respeitar os seguintes princípios:

1. UI não contém lógica de negócio
2. UI não acessa APIs diretamente
3. Stores coordenam estado
4. Services acessam dados
5. Features isolam domínios
6. Shared UI contém componentes genéricos

---

# Mudanças Arquiteturais

Agents **não devem alterar a arquitetura da aplicação sem pedido explícito**.

Mudanças estruturais só devem ocorrer quando solicitadas diretamente.

---

# Objetivo do Brain Map

Este documento permite que ferramentas de IA:

- compreendam rapidamente a estrutura do projeto
- implementem funcionalidades no local correto
- respeitem a separação de responsabilidades
- preservem consistência arquitetural