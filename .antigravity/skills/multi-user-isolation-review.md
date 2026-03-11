# Multi User Isolation Review

This skill defines rules for auditing **data isolation and session safety** in applications that support multiple authenticated users.

The objective is to ensure that:

- users cannot access or modify other users’ data
- sessions are isolated
- frontend state does not leak across users
- backend queries always enforce ownership

This review is essential for **multi-tenant SaaS applications**.

---

# User Data Isolation

Every data access must be scoped to the authenticated user.

The system must guarantee that:

- queries filter by `user_id`
- inserts always attach the correct `user_id`
- updates cannot affect rows owned by other users
- deletes respect ownership constraints

Safe pattern example:

where user_id = auth.uid()

Never rely solely on the frontend to enforce user isolation.

---

# Supabase RLS Enforcement

Verify that Row Level Security (RLS) is correctly configured.

Each table containing user data must:

- have RLS enabled
- contain policies scoped by `auth.uid()`
- prevent cross-user reads and writes

Example policy pattern:

using (auth.uid() = user_id)

Also verify that services do not attempt to bypass RLS.

---

# Session Integrity

Ensure the authenticated session is the **single source of truth**.

Check that:

- services retrieve the user id from the auth session
- the frontend does not manually inject user identifiers
- requests cannot impersonate another user

Avoid patterns where the UI supplies the user id directly.

---

# Store State Isolation

Frontend state must reset correctly when sessions change.

Check that:

- stores clear user data on logout
- login with a different user does not reuse previous state
- cached records do not persist across sessions
- session rehydration does not mix data between users

Stores should always reload data after authentication changes.

---

# Multi-Tab Behaviour

Verify correct behaviour when multiple browser tabs are open.

Check for:

- session synchronization issues
- stale data after login/logout in another tab
- duplicated listeners reacting incorrectly to auth changes

Applications must remain consistent across tabs.

---

# Race Conditions

Identify race conditions involving user sessions.

Examples:

- requests finishing after logout
- state updates applied to a new session
- concurrent actions affecting the same records

Ensure that state updates validate the active user session.

---

# Service Layer Protection

All database access must flow through the service layer.

Architecture must follow:

UI
↓
Store
↓
Service
↓
Database

Avoid:
- direct database calls in UI components
- services trusting client-provided identifiers
- authorization logic implemented only in the frontend
---
# Security Severity Classification

Issues should be categorized as:

**Critical**

- cross-user data exposure
- broken RLS policies
- services trusting external user ids

**High**

- session state leaking between users
- requests executing under incorrect session

**Medium**

- stale cache after login/logout
- inconsistent multi-tab behaviour

**Low**

- minor session handling improvements

---

# Expected Outcome

The system should guarantee that:

- each user only accesses their own data
- sessions remain isolated
- state transitions are safe
- backend policies enforce ownership