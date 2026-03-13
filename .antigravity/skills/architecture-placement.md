# Skill: Architecture Placement

Use this skill to validate whether code is being placed in the correct architectural layer.

## Purpose

Ensure that responsibilities are distributed correctly across the project structure and that no layer is doing work that belongs elsewhere.

## Project Architecture

All code must respect this strict layering:

```
UI (React Components)
        ↓
State Layer (Zustand Stores)
        ↓
Service Layer (Supabase Services)
        ↓
Database (Supabase Postgres + RLS)
```

## Layer Responsibilities

**UI Components**
- Presentation and interaction only
- Read state from Zustand stores
- Dispatch actions to stores
- Never access Supabase directly

**Zustand Stores**
- Coordinate state and feature-level orchestration
- Call services for data access
- Handle loading, error, and data state
- Never contain persistence or query logic

**Services**
- Encapsulate all Supabase access
- Apply `.eq('user_id', userId)` on every query
- Use mappers to convert between Domain Models and DTOs
- Never expose raw Supabase response shapes to stores or UI

**Mappers**
- Handle all camelCase ↔ snake_case conversion
- Convert Domain Models → DTOs for writes
- Convert DTOs → Domain Models for reads

**Database (Supabase + RLS)**
- Last line of defense for data isolation
- RLS policies scoped by `auth.uid() = user_id`

## Validate

- UI components only handle presentation and interaction
- Stores coordinate state and feature-level orchestration
- Services encapsulate all data access and persistence calls
- Mappers handle all data shape conversion
- Business rules are not embedded in visual components
- API/database access is not performed directly from UI or stores

## Warning signs

- Components calling Supabase directly
- Business decisions inside JSX or render logic
- Services storing UI state
- Stores mixing persistence details with UI formatting
- Raw snake_case data shapes reaching the UI
- `user_id` being sourced from the UI instead of the auth session

## Output expectation

State:
1. what is correctly placed
2. what is misplaced
3. what should be moved and to which layer
4. whether the current implementation should be accepted or adjusted