# Skill: Data Flow Segregation

Use this skill to validate whether data moves through the system in a clean, predictable, and maintainable way.

## Purpose

Ensure that data flow respects the intended boundaries between UI, state management, services, and persistence.

## Established Data Flow

```
UI Component
    ↓ dispatches action
Zustand Store
    ↓ calls service
Service Layer
    ↓ queries Supabase + applies mapper
Database (Supabase + RLS)
```

Data must always flow in this direction. Reverse flows or shortcuts are violations.

## Mapper Contract

- Services receive Domain Models (camelCase) from stores
- Services convert to DTOs (snake_case) via mappers before writing
- Services convert DTOs (snake_case) to Domain Models (camelCase) after reading
- UI always receives camelCase Domain Models — never raw Supabase shapes

## Validate

- UI receives data through props, hooks, or store access
- Store orchestrates state and feature actions
- Services handle persistence and external communication
- Mappers are the only place where camelCase ↔ snake_case conversion happens
- Data transformations happen in appropriate boundaries
- Source of truth is clear
- The same data is not being duplicated across layers without reason

## Warning signs

- UI transforming data that should arrive already prepared
- Store directly coupled to raw Supabase response shapes
- snake_case fields appearing in UI components
- Same data shape being rebuilt repeatedly in many places
- Persistence response leaking deeply into UI
- Unclear ownership of loading, error, or mutation state
- Services not applying mappers consistently

## Output expectation

Describe:
1. current flow
2. separation quality
3. boundary violations
4. mapper usage correctness
5. recommended adjustments