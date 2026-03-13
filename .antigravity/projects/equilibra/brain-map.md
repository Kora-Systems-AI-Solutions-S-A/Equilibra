# Equilibra — Brain Map

This document describes the **mental map of the Equilibra application**.

It helps AI tools understand:

- system structure
- application domains
- data flow
- layer responsibilities

This document **does not replace project-context** — it complements it with a structural overview.

---

# Application Domain

Equilibra is a **personal finance management application** in production.

The goal is to give users a **clear view of their financial situation** and help them make conscious financial decisions.

Main domain areas:

- Debt planning
- Income and expense tracking
- Monthly financial summary
- Investment management and contributions

---

# Functional Domains

## Auth

Responsible for:

- real authentication via Supabase Auth
- session management
- route protection
- store cleanup on logout and auth state change

Location:

```
src/features/auth
```

---

## Dashboard

Responsible for the consolidated financial view of the user.

Location:

```
src/features/dashboard
```

The dashboard is composed of **independent cards**, each representing a financial domain.

Current cards:

- Debt Planning
- Income
- Monthly Summary
- Investments

Each card represents **an isolated financial domain**.

Empty states are implemented in all cards.

---

# Application Architecture

The application follows an architecture based on **features + separated layers**.

Main structure:

```
src
│
├─ core
├─ features
├─ pages
├─ services
├─ store
├─ mappers
├─ models
└─ shared
```

---

# Layer Responsibilities

## UI (features / shared/ui)

Responsible for:

- presentation
- interaction
- layout
- empty states

The UI **must not contain business logic**.
The UI **must not access Supabase directly**.

---

## Store (Zustand)

Responsible for:

- state coordination
- feature actions
- service communication
- loading and error state

Main stores:

- `auth.store`
- `monthlyRecords.store`
- `debtPlans.store`
- `investments.store`
- `notification.store`

All stores implement `reset()` and are cleared on logout and auth state change.

The store acts as the **application logic orchestrator**.

---

## Services

Responsible for:

- data access via Supabase
- queries filtered by `user_id`
- using mappers for data transformation

Services **must not contain UI logic**.

---

## Mappers

Responsible for converting between:

- Domain Models (camelCase) → used in stores and UI
- DTOs (snake_case) → used in Supabase queries

This is the **only layer** where format conversion occurs.

---

## Core

Responsible for:

- infrastructure
- Supabase client
- global configuration

---

# Data Flow

Standard application flow:

```
UI
↓
Feature Components
↓
Store (Zustand)
↓
Services (+ Mappers)
↓
Core (Supabase Client)
↓
Database (PostgreSQL + RLS)
```

This flow **must be preserved**.

The UI **must never access Supabase directly**.

---

# Data Domains (Supabase)

| Table | Description |
|---|---|
| `profiles` | Auto-created via trigger on `auth.users` |
| `monthly_records` | Monthly income and expense entries |
| `debt_plans` | Debt payoff planning with auto-calculated end date |
| `investments` | Investment plans |
| `investment_contributions` | Contribution history linked to investments |

RLS active on all tables: `auth.uid() = user_id`

Investment balance is calculated in memory inside the service.

---

# Feature Organization

Each feature is organized by functional domain.

Example:

```
features/dashboard
  ├─ investimentos
  ├─ planejamento-dividas
  └─ resumo-mensal
```

Inside each domain there may be:

- components
- modals
- domain-specific hooks
- utilities

---

# Design System

Reusable components live in:

```
src/shared/ui
```

Examples:

- Button
- ModalBase
- FloatingLabelInput
- MoneyInput
- DrawerBase
- NotificationContainer

These components must be **domain-agnostic**.

---

# Notification System

User feedback uses **toast notifications**.

- `notification.store.ts` — state and actions
- `NotificationContainer.tsx` — rendering

Types: `success`, `warning`, `error`, `info`

**This is the established standard. Do not introduce alternatives.**

---

# Motion and Interactions

The application uses **Framer Motion**.

Goals:

- smooth animations
- clear visual feedback
- premium interface feel

Established use cases:

- page transitions
- toast notification animations
- UI feedback

Motion must be **subtle and functional**, never distracting.

---

# Multi-User Security

Critical pattern — implemented and audited:

1. RLS on all tables (`auth.uid() = user_id`)
2. Services apply `.eq('user_id', userId)` on every query
3. All stores call `reset()` on logout and auth state change

**These patterns must not be removed or weakened.**

---

# Architectural Principles

AI tools must always respect the following principles:

1. UI does not contain business logic
2. UI does not access Supabase directly
3. Stores coordinate state and reset on logout
4. Services access data and apply mappers
5. Mappers are the only format conversion layer
6. Features isolate domains
7. Shared UI contains generic components

---

# Architectural Changes

Agents **must not change the application architecture without explicit request**.

Structural changes must only occur when directly instructed.

---

# Brain Map Goal

This document allows AI tools to:

- quickly understand the project structure
- implement features in the correct location
- respect separation of responsibilities
- preserve architectural consistency
- protect the established security patterns