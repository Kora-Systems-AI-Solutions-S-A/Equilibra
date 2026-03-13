# Skill: Multi User Isolation Review

This skill audits **data isolation and session safety** in applications that support multiple authenticated users.

The objective is to ensure that:
- Users cannot access or modify other users' data
- Sessions are isolated at all layers
- Frontend state does not leak across users
- Backend queries always enforce ownership

This review is critical for **multi-tenant SaaS applications**.

---

## Project Context

The following isolation patterns are already established and must be preserved:

- **RLS** enabled on all tables with `auth.uid() = user_id` policies
- **Service layer** applies `.eq('user_id', userId)` on every query as a secondary guard
- **All Zustand stores** call `reset()` on logout and on auth state change
- **Auth state change listener** triggers store cleanup to prevent dirty state between users
- `user_id` is always sourced from the authenticated session — never from UI input

These patterns were specifically implemented to fix a multi-user dirty state vulnerability. Never remove or weaken them.

---

# User Data Isolation

Every data access must be scoped to the authenticated user.

Check that:
- Queries filter by `user_id`
- Inserts always attach the correct `user_id` from the auth session
- Updates cannot affect rows owned by other users
- Deletes respect ownership constraints

Safe pattern:
```sql
where user_id = auth.uid()
```

Never rely solely on the frontend to enforce user isolation.

---

# Supabase RLS Enforcement

Verify that Row Level Security is correctly configured.

Each table containing user data must:
- Have RLS enabled
- Contain policies scoped by `auth.uid()`
- Prevent cross-user reads and writes

Also verify that new tables added to the project include RLS policies before going to production.

---

# Session Integrity

Ensure the authenticated session is the **single source of truth**.

Check that:
- Services retrieve `user_id` from the auth session
- The frontend does not manually inject user identifiers
- Requests cannot impersonate another user

---

# Store State Isolation

Frontend state must reset correctly when sessions change.

Check that:
- All stores call `reset()` on logout
- All stores call `reset()` on auth state change
- Login with a different user does not reuse previous user's state
- Cached records do not persist across sessions
- Session rehydration does not mix data between users

This is a critical pattern — verify it is preserved in all stores including any newly created ones.

---

# Multi-Tab Behaviour

Verify correct behaviour when multiple browser tabs are open.

Check for:
- Session synchronization issues across tabs
- Stale data after login/logout in another tab
- Duplicated auth listeners reacting incorrectly

---

# Race Conditions

Identify race conditions involving user sessions:
- Requests finishing after logout and applying state to a new session
- State updates applied under the wrong user context
- Concurrent actions affecting the same records

---

# Service Layer Protection

All database access must flow through the service layer:

```
UI → Store → Service → Database
```

Avoid:
- Direct database calls in UI components
- Services trusting client-provided identifiers
- Authorization logic implemented only in the frontend

---

# Security Severity Classification

**Critical**
- Cross-user data exposure
- Broken RLS policies
- Services trusting external user ids
- Stores not resetting on logout

**High**
- Session state leaking between users
- Requests executing under incorrect session
- New stores missing `reset()` implementation

**Medium**
- Stale cache after login/logout
- Inconsistent multi-tab behaviour

**Low**
- Minor session handling improvements

---

# Expected Outcome

The system must guarantee that:
- Each user only accesses their own data
- Sessions remain isolated at all layers
- State transitions are safe and clean
- Backend policies enforce ownership independently of the frontend