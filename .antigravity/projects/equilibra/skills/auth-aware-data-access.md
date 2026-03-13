# Skill: Auth-Aware Data Access

Use this skill to validate whether data access decisions in Equilibra correctly respect authentication and user ownership boundaries.

## Purpose

Ensure that all financial data access is designed with explicit user ownership, authenticated access, and safe separation between session logic and domain data.

## Project context

Equilibra is a personal finance application in production using:

- Supabase Auth for authentication
- PostgreSQL with Row Level Security
- Service layer as the only access point to Supabase
- `user_id` always sourced from the authenticated session

## Established security model

Security is enforced at three layers — all must be preserved:

1. **RLS** — `auth.uid() = user_id` on all tables
2. **Service Layer** — `.eq('user_id', userId)` on every query
3. **Auth Session** — `user_id` never comes from UI input

## Validate

- Financial data access is always scoped to the authenticated user
- Session and identity concerns are explicit
- Auth state is not assumed implicitly in random components
- UI does not directly control protected data access
- Services apply user scoping on every query
- Data ownership is clear for every read and write operation
- Multi-user isolation is preserved — stores reset on logout and auth state change
- New tables include RLS policies before going to production

## Warning signs

- Queries that do not scope data by `user_id`
- Components making assumptions about user identity without proper state boundaries
- Protected records being treated as globally accessible
- Auth-dependent logic scattered across the UI layer
- Services accepting `user_id` from props or component state
- New stores missing `reset()` implementation
- Financial entities without clear ownership mapping

## Output expectation

Describe:

1. what is correct in the current access pattern
2. where ownership or auth boundaries are unclear
3. risks related to user isolation
4. what should be adjusted to maintain the established security model