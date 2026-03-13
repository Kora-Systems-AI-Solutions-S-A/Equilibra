# Equilibra — Product Roadmap

This document defines the planned evolution of the Equilibra product.

It must be loaded as part of the project context so that agents understand the current phase, what has been completed, and what is planned.

Agents must respect this roadmap when making implementation decisions and must not suggest features or architectural changes that conflict with the planned phases.

---

# Current Status

- **Production**: Deployed on Vercel
- **Active Phase**: Phase 1 (in progress)
- **Completed**: Core features, Supabase integration, RLS, multi-user isolation, toast notifications, empty states, mobile fixes

---

# Roadmap

## Phase 1 — Foundation & Auth
> Complete the authentication foundation

- [ ] Google Login
- [ ] Email confirmation screen
- [ ] Password recovery screen
- [ ] User profile configuration
  - [ ] Password update
  - [ ] Currency preference
  - [ ] Account settings

---

## Phase 2 — UX & Visual Polish
> Improve the experience with existing data before adding more

- [ ] Standardization of charts, grids, and value formatting
- [ ] Filters by period on dashboard
- [ ] Automatic monthly financial summary
- [ ] Mobile Bottom Navigation
- [ ] Guided onboarding flow

---

## Phase 3 — Data & Records
> Expand what the user can register and manage

- [ ] Investment balance view
- [ ] Recurring records
  - [ ] Create / update / delete recurring entries
  - [ ] Monthly reminder notifications for recurring records
- [ ] Payment methods
  - [ ] Register payment method per recurring record
  - [ ] Automatic opening of payment app (MBWay, bank app)
- [ ] Data export (CSV / PDF)

---

## Phase 4 — Notifications & Engagement
> Bring the user back with relevant financial context

- [ ] Automatic financial notifications
  - [ ] Expense limit alerts
  - [ ] Debt due date reminders
  - [ ] Monthly balance summary notification
- [ ] In-app notification center
- [ ] Personal financial goals with progress tracking

---

## Phase 5 — Platform & Infrastructure
> Solidify the platform before growing in complexity

- [ ] PWA — installable application
- [ ] Supabase migration versioning
- [ ] API layer between frontend and Supabase
  - [ ] Remove business logic from frontend
  - [ ] Centralize validation and security rules
  - [ ] Prepare architecture for future AI integration

---

## Phase 6 — Intelligence
> Real product differentiation with integrated AI

- [ ] AI financial analysis
  - [ ] Spending pattern insights
  - [ ] Automatic suggestions based on history
- [ ] Natural language record entry
  - [ ] Example: "Spent 50€ on groceries today"
- [ ] Automatic invoice capture from email
  - [ ] Parse incoming invoices and suggest record creation
- [ ] Patrimony evolution history
  - [ ] Combined view of investments, debts, and monthly balance over time

---

## Phase 7 — Growth
> Expand the product reach

- [ ] Family / multi-profile sharing
- [ ] Custom categories
- [ ] Full mobile experience refinement post-PWA
- [ ] Reporting and automatic insights dashboard

---

# Strategic Notes

## API Layer is a prerequisite for AI
Phase 5 API layer must be completed before Phase 6 AI integration.
Without it, AI features will be coupled to the frontend, creating security and maintenance issues.

## PWA and Bottom Navigation must be planned together
Bottom Navigation (Phase 2) and PWA (Phase 5) affect the same mobile layout.
Plan them together to avoid rework even if implemented in separate phases.

## Email invoice capture requires external integration
Phase 6 email capture requires Gmail API or similar and a parsing pipeline.
It should only be implemented after the API layer is stable.

---

# How to Update This Roadmap

When a feature is completed, mark it with `[x]` and update the Current Status section.

When a new feature is added, place it in the correct phase based on its complexity and dependencies.

When a phase is fully completed, add a completion note:

```
## Phase 1 — Foundation & Auth ✅ Completed
```

---

# Vision

```
Phase 1 → Auth complete
Phase 2 → UX polished
Phase 3 → Data rich
Phase 4 → Engaged users
Phase 5 → Solid platform
Phase 6 → Intelligent product
Phase 7 → Growth
```