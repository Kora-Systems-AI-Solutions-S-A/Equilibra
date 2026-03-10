# Skill: Supabase Transition Readiness

Use this skill to evaluate whether the current Equilibra implementation is structurally ready to transition from mocked data to real Supabase persistence.

## Purpose

Prepare the project for a safe and maintainable migration toward real authenticated persistence using Supabase.

## Project context

Equilibra currently has a functional frontend MVP with mocked authentication and dashboard behavior.

The next major step is migration to:

- Supabase Auth
- PostgreSQL
- Row Level Security
- real persistence flows

The architecture is expected to preserve separation between:

- UI
- Store
- Services
- Core infrastructure

## Validate

- Data access concerns are already isolated enough
- Services are ready to become real persistence adapters
- Stores are not tightly coupled to mocked implementations
- UI does not depend on mock-specific assumptions
- Auth flow can evolve from mock session to real authenticated session
- Domain structures are ready for database-backed records
- The project can absorb persistence without architectural rewrites

## Warning signs

- Mock data patterns leaking into multiple layers
- UI depending directly on fake contracts
- Stores acting as data sources instead of orchestrators
- Auth assumptions hardcoded in presentation flow
- Domain shapes that are too UI-specific to persist cleanly
- Missing ownership boundaries for future user-specific records

## Output expectation

Describe:

1. what is already ready for the Supabase transition
2. what is too coupled to the mocked phase
3. what must be adapted before persistence goes live
4. how to transition incrementally without breaking the architecture