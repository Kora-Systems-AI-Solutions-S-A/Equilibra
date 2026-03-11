# Equilibra

**Equilibra** is a modern personal finance management application designed to provide clarity, control and long-term financial awareness.

The system allows users to manage:

- income and expenses
- debt payoff planning
- investments and contributions
- financial trends and dashboards

Equilibra focuses on **simplicity, data clarity and a premium visual experience**, helping users make better financial decisions.

---

# Core Features

Current capabilities include:

### Authentication
- Email / password authentication
- Supabase session management
- persistent login sessions

### Monthly Financial Records
Users can manage financial movements:

- income records
- expense records
- categorized spending
- monthly summaries

### Debt Payoff Planning
Users can create structured plans to eliminate debt.

Features include:

- start date
- installment value
- automatic end date calculation
- debt tracking

### Investment Tracking
Users can track investments and contributions.

Features include:

- investment creation
- contributions history
- accumulated balance calculation

### Financial Dashboard

Dashboard visualizations include:

- income vs expenses
- spending by category
- financial trend over time
- monthly summaries

---

# Architecture

The project follows a strict layered architecture:


UI
↓
State Management (Zustand)
↓
Services
↓
Supabase API
↓
Database


Responsibilities are clearly separated:

| Layer | Responsibility |
|------|---------------|
| UI | React components and interaction |
| Store | State orchestration |
| Services | Business logic and API communication |
| Supabase | Authentication and persistence |
| Database | Data storage with RLS |

This architecture ensures:

- predictable data flow
- clear separation of concerns
- safer refactoring
- easier scalability

---

# Technology Stack

## Frontend

| Technology | Purpose |
|-----------|--------|
| React | UI framework |
| TypeScript | Type safety |
| Vite | Build tool |
| Zustand | State management |
| Framer Motion | Animations |
| Supabase JS | Backend communication |

---

## Backend / Infrastructure

| Technology | Purpose |
|-----------|--------|
| Supabase | Backend platform |
| PostgreSQL | Database |
| Supabase Auth | Authentication |
| Row Level Security (RLS) | Data isolation |
| Supabase Storage | Optional future usage |

---

## AI Development Layer

The project includes a structured AI-assisted development layer located in:

.antigravity

This layer defines:

- engineering agents
- reusable technical skills
- project rules
- AI development context

The goal is to ensure that AI tools:

- respect the project architecture
- generate consistent code
- avoid architectural drift

See:

.antigravity/README.md

for full documentation.

---

# Security Model

Equilibra uses **Supabase Row Level Security (RLS)** to enforce strict user isolation.

Each table enforces ownership through:

auth.uid() = user_id

Security guarantees:

- users can only access their own data
- cross-user queries are prevented
- all services scope queries by user

Additional frontend safeguards ensure:

- store state resets on logout
- no session data leaks across users
- multi-tab session consistency

---

# Database Overview

Main tables:

| Table | Purpose |
|------|--------|
| profiles | user profile information |
| monthly_records | income and expenses |
| debt_plans | debt payoff plans |
| investments | user investments |
| investment_contributions | investment contributions |

All tables use:

- user ownership
- Row Level Security
- Supabase authentication integration

---

# Project Structure


src
│
├─ components
│ reusable UI components
│
├─ pages
│ application screens
│
├─ stores
│ Zustand state management
│
├─ services
│ API communication and business logic
│
├─ mappers
│ DTO ↔ domain mapping
│
└─ core
shared utilities and Supabase client


---

# Development Setup

## Requirements

- Node.js 18+
- npm or pnpm
- Supabase project

---

## Install dependencies

```bash
npm install
Environment Variables

Create a .env file:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
Run the project
npm run dev

Application will run on:

http://localhost:3000

Authentication

Current authentication methods:

Email + password

Future support:

Google OAuth

additional providers

Deployment

Typical deployment setup:

Frontend:

Vercel

Netlify

Cloudflare Pages

Backend:

Supabase

Required environment variables must be configured in the hosting provider.

AI Assisted Development

Equilibra integrates structured AI-assisted development through the .antigravity system.

Agents and skills ensure:

architecture compliance

safer automated code generation

structured refactoring

design system consistency

This allows AI tools to operate as engineering assistants rather than autonomous code generators.

Roadmap

Planned improvements:

Google OAuth login

financial insights engine

budgeting system

recurring transactions

advanced investment analytics

mobile optimization

Philosophy

Equilibra is built around a few key principles:

clarity over complexity

predictable architecture

secure multi-user data isolation

gradual feature evolution

AI-assisted engineering with human control

The goal is to create a modern, reliable and extensible financial management platform.

License

Private project.