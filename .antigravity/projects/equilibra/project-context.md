# Project Context — Equilibra

## Overview

Equilibra is a modern **personal finance management application**, focused on:

- financial clarity
- income and expense organization
- debt management
- financial growth tracking
- data visualization through dashboards

The application is designed with a focus on:

- ease of use
- premium visual experience
- conscious financial decision-making

The goal is to give users **full control of their financial life in one place**.

---

# Current Project Status

The project is **in production**, deployed on Vercel.

Current state:

- Supabase fully integrated
- Real authentication via Supabase Auth
- Real persistence on PostgreSQL
- RLS active on all tables
- Deployed on Vercel
- Feature complete and audited
- Polished UX with empty states, toast notifications, and mobile fixes

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Zustand (state management)
- Framer Motion (animations)
- Tailwind CSS
- Internal design system

## Backend / Infra

- Supabase (PostgreSQL + Auth + RLS)
- Vercel (deployment)

## Environment Variables

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

---

# Application Architecture

The project follows an architecture based on:

**features + separated layers + centralized infrastructure**

Main project structure:

```
src/
│
├─ assets/
│  Static images and files
│
├─ core/
│  Technical infrastructure
│  ├─ api/        Central HTTP client and error handling
│  ├─ config/     Global configuration
│  └─ supabase/   Supabase client
│
├─ features/
│  Functional application modules
│
├─ helpers/
│  Application-specific utility functions
│
├─ hooks/
│  Reusable hooks
│
├─ lib/
│  Low-level utilities
│
├─ mappers/
│  Conversion between DTOs (snake_case) and Domain Models (camelCase)
│
├─ models/
│  Types and data contracts
│
├─ pages/
│  Main pages that orchestrate features
│
├─ services/
│  Data access layer — Supabase integration
│
├─ shared/
│  Reusable components and design system
│
└─ store/
   Global application state (Zustand)
```

---

# Layer Responsibilities

## features

Contains **functional application modules**.

Examples:

- auth
- dashboard
- investments
- debt planning
- monthly summary

Features may contain:

- components
- modals
- forms
- sub-features

---

## pages

Defines **main application pages**.

Examples:

- AuthPage
- DashboardPage

Pages are responsible for:

- layout composition
- feature orchestration

Pages **must not contain business logic**.

---

## shared

Contains **reusable components across features**.

Examples:

- Button
- Drawer
- Modal
- Tooltip
- MoneyInput
- LoadingOverlay
- NotificationContainer

This layer acts as the **internal design system of the application**.

---

## services

Responsible for:

- data access via Supabase
- safe and parameterized queries
- applying `.eq('user_id', userId)` on every query
- using mappers to convert DTOs to Domain Models and vice versa

The UI **never accesses Supabase directly**.

---

## mappers

Responsible for converting between:

- Domain Models (camelCase) — used in UI and stores
- DTOs (snake_case) — used in Supabase queries

This is the **only layer** where camelCase ↔ snake_case conversion occurs.

---

## store

Manages global application state using **Zustand**.

Main stores:

- `auth.store` — authentication and session
- `monthlyRecords.store` — income and expenses
- `debtPlans.store` — debt planning
- `investments.store` — investments
- `notification.store` — toast notification system

All stores implement `reset()` and are cleared on logout and auth state change to prevent dirty state between users.

---

## Notification System

User feedback uses the **toast notification system**.

Files:

- `notification.store.ts`
- `NotificationContainer.tsx`

Supported types: `success`, `warning`, `error`, `info`

**This is the established standard for user feedback. Do not introduce alternatives.**

---

# Data Domains

Supabase tables:

| Table | Description |
|---|---|
| `profiles` | Auto-created via trigger on `auth.users` |
| `monthly_records` | Monthly income and expense entries |
| `debt_plans` | Debt payoff planning with auto-calculated end date |
| `investments` | Investment plans |
| `investment_contributions` | Contribution history linked to investments |

RLS active on all tables with policy `auth.uid() = user_id`.

---

# Security

Security enforced at multiple layers:

1. **RLS (Supabase)** — `auth.uid() = user_id` on all tables
2. **Service Layer** — `.eq('user_id', userId)` on every query
3. **Auth Session** — `user_id` always comes from the authenticated session, never from the UI

All stores call `reset()` on logout and on auth state change.

A dirty state vulnerability between users was identified, fixed, and audited. These correction patterns **must not be removed**.

---

# Data Flow

```
UI Component
    ↓ dispatches action
Zustand Store
    ↓ calls service
Service Layer (applies mapper + user_id filter)
    ↓
Supabase (PostgreSQL + RLS)
```

The UI **must never access APIs or Supabase directly**.

---

# Authentication

Managed by **Supabase Auth**.

- Secure sessions with automatically managed tokens
- Persistent authentication
- Secure table access via RLS
- Auth state change listener clears all stores

---

# UI Standards

The interface follows design principles:

- premium dark visual
- minimalism
- consistency
- smooth animations via Framer Motion

Main colors: graphite and green

Responsive layout supports: desktop, tablet, mobile

Empty states implemented across all dashboard sections.

---

# Dashboard Structure

The dashboard presents independent cards per financial domain:

- Debt Planning
- Income
- Monthly Summary
- Investments

Components are organized by feature inside `features/dashboard`.

---

# Current Backlog

| Item | Area |
|---|---|
| Google Login | Auth |
| Bottom Navigation | Mobile UX |
| Investment balance view | Data Layer |
| Supabase migration versioning | Infra |

---

# Implementation Rules

Agents must follow these core rules:

1. Never change architecture without explicit request
2. Do not move files between folders without authorization
3. Do not duplicate existing components
4. Do not break existing imports
5. Do not introduce business logic in the UI
6. Use import aliases (`@/`)
7. Never remove multi-user isolation patterns
8. Always use the toast system for user feedback

---

# Code Quality

Code must prioritize:

- readability
- modularity
- single responsibility
- low coupling
- component reuse

Refactors must preserve existing behavior and security patterns.

---

# Antigravity System Goal

Agents and skills exist to ensure that:

- new features respect the architecture
- code remains organized
- technical decisions are consistent
- security is preserved
- the project can evolve with stability