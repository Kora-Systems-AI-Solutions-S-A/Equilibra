# Load and Security Review

This skill defines rules for reviewing **security boundaries, request load, and potential performance risks** in the application.

It helps identify:

- data leakage between users
- insecure authorization patterns
- excessive API or database calls
- request duplication
- race conditions
- performance bottlenecks

This review should be used during architecture validation or code audits.

---

# Security Review

The agent must verify that the application properly protects user data.

## User Isolation

Ensure that all data access respects user boundaries.

Check that:

- every query is scoped by `user_id`
- services never trust `userId` coming directly from the UI
- access control is enforced in the backend layer

Example of safe pattern:


where user_id = auth.uid()


Avoid queries that could expose data across users.

---

## Authentication Safety

Verify that:

- the authenticated session is the source of truth
- services do not accept arbitrary user identifiers
- sensitive operations are never authorized only in the UI

---

## Input Safety

Check that external inputs are validated before persistence.

Focus on:

- numeric limits
- required fields
- preventing unsafe values reaching database queries

---

# Request Load Review

The system should avoid unnecessary or repeated backend calls.

## Duplicate Requests

Look for cases where:

- `useEffect` triggers multiple identical requests
- stores re-fetch data unnecessarily
- actions are called repeatedly without state checks

Requests must only run when required.

---

## Fetch in Render

Ensure that:

- API calls do not occur inside component render bodies
- requests are triggered through stores or controlled effects

---

## Dashboard Load

Verify that the dashboard does not trigger excessive parallel queries.

Prefer:

- consolidated queries
- shared state
- cached results

---

## Query Boundaries

Ensure queries include proper constraints.

Check for:

- missing filters
- lack of limits
- large uncontrolled result sets

---

# Concurrency Risks

Identify potential race conditions such as:

- overlapping updates to the same entity
- outdated responses overriding newer state
- multiple concurrent requests for the same data

Prefer predictable state updates.

---

# Architecture Integrity

Ensure the architecture flow is respected:

UI
↓
Store
↓
Service
↓
Database

Avoid:

- UI calling the database directly
- authorization logic in the UI layer
- data queries outside the service layer

---

# Severity Classification

Issues must be categorized:

**Critical**
- user data leakage
- broken access control

**High**
- repeated requests
- race conditions
- uncontrolled queries

**Medium**
- inefficient data fetching
- heavy frontend calculations

**Low**
- minor performance improvements