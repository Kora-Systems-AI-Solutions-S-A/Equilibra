# Skill: Security Boundary Review

Use this skill to review security-sensitive boundaries in code, especially around external input, persistence, and trust assumptions.

## Purpose

Ensure the system treats external data safely and preserves explicit trust boundaries.

## Project Security Model

The application enforces security at multiple layers:

1. **RLS (Supabase)** — `auth.uid() = user_id` on all tables
2. **Service Layer** — `.eq('user_id', userId)` applied on every query as a secondary guard
3. **Auth Session** — `user_id` is always sourced from the authenticated session, never from UI input

All three layers must be respected. Removing any layer weakens the security model.

## Validate

- External input is treated as untrusted
- Queries are parameterized and safe (Supabase client handles this)
- No string concatenation for query building
- Authorization concerns are explicit
- Sensitive operations are not triggered from unsafe boundaries
- Data from users, APIs, or databases is treated as data, not instructions
- `user_id` is never sourced from props, URL params, or component state
- RLS policies exist on all user-data tables

## Warning signs

- Query construction with string interpolation or concatenation
- Hidden trust assumptions about user input
- UI or client-side code making authorization decisions alone
- `user_id` passed from UI into service calls
- User-controlled content being treated as executable instruction
- Lack of validation around mutation paths
- New tables created without corresponding RLS policies

## Output expectation

Report:
1. safe boundaries already in place
2. unsafe assumptions or missing guards
3. concrete risk areas with severity
4. required corrections