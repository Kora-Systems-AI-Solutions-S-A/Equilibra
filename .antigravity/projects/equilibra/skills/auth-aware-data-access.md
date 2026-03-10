# Skill: Auth-Aware Data Access

Use this skill to validate whether data access decisions in Equilibra correctly respect authentication and user ownership boundaries.

## Purpose

Ensure that all financial data access in Equilibra is designed with explicit user ownership, authenticated access, and safe separation between session logic and domain data.

## Project context

Equilibra is a personal finance application.

Its data is user-specific and should always be treated as private by default.

Persistence is planned around:

- Supabase
- Supabase Auth
- PostgreSQL
- Row Level Security

## Validate

- Financial data access is always scoped to the authenticated user
- Session and identity concerns are explicit
- Auth state is not assumed implicitly in random components
- UI does not directly control protected data access
- Services are prepared to work with authenticated persistence
- Data ownership is clear for every read and write operation
- Multi-user isolation is preserved conceptually

## Warning signs

- Queries that do not clearly scope data by authenticated ownership
- Components making assumptions about user identity without proper state boundaries
- Protected records being treated as globally accessible
- Auth-dependent logic scattered across the UI layer
- Services that are not designed for per-user data isolation
- Financial entities without clear ownership mapping

## Output expectation

Describe:

1. what is correct in the current access pattern
2. where ownership or auth boundaries are unclear
3. risks related to user isolation
4. what should be adjusted before or during Supabase integration