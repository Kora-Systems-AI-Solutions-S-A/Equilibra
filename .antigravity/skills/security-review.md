# Skill: Security Review

Use this skill to audit **security boundaries, user isolation, and authorization patterns** in the application.

## Purpose

Ensure the system treats external data safely, preserves explicit trust boundaries, and protects user data at all layers.

## Project Security Model

Security is enforced at three layers — all must be preserved:

1. **RLS (Supabase)** — `auth.uid() = user_id` on all tables
2. **Service Layer** — `.eq('user_id', userId)` applied on every query as a secondary guard
3. **Auth Session** — `user_id` is always sourced from the authenticated session, never from UI input

Removing or weakening any layer compromises the security model.

---

## User Isolation

Ensure all data access respects user boundaries.

Check that:
- Every query is scoped by `user_id`
- Services never trust `userId` coming from the UI
- Access control is enforced at both the service and database layers

Safe pattern:
```sql
where user_id = auth.uid()
```

---

## Authentication Safety

Verify that:
- The authenticated session is the source of truth for `user_id`
- Services do not accept arbitrary user identifiers from props or state
- Sensitive operations are never authorized only in the UI

---

## Input Safety

Check that external inputs are validated before persistence:
- Numeric limits enforced
- Required fields validated
- Unsafe values cannot reach database queries

---

## RLS Enforcement

Verify that Row Level Security is correctly configured.

Each table containing user data must:
- Have RLS enabled
- Contain policies scoped by `auth.uid()`
- Prevent cross-user reads and writes

New tables added to the project must include RLS policies before going to production.

---

## Architecture Integrity

Ensure the architecture flow is respected:

```
UI → Store → Service → Database
```

Avoid:
- UI calling Supabase directly
- Authorization logic in the UI layer
- Data queries outside the service layer

---

## Severity Classification

**Critical**
- User data leakage between sessions
- Broken RLS or missing `user_id` filters
- Services trusting client-provided identifiers
- New tables without RLS policies

**High**
- `user_id` sourced from UI instead of auth session
- Authorization decisions made only in the frontend

**Medium**
- Missing input validation on mutation paths
- Weak boundary assumptions on external data

**Low**
- Minor hardening improvements

## Output expectation

Report:
1. safe boundaries already in place
2. unsafe assumptions or missing guards
3. concrete risk areas with severity
4. required corrections