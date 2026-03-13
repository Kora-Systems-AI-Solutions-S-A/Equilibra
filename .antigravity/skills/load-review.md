# Skill: Load Review

Use this skill to audit **request load, performance risks, and data fetching patterns** in the application.

## Purpose

Detect issues that could impact scalability, stability, or user experience due to excessive or inefficient data fetching.

## Project Context

- Architecture: UI → Zustand Store → Service → Supabase
- Stores are responsible for triggering fetches — never components directly
- Investment balance is calculated in memory inside the service — watch for performance impact as data grows
- Dashboard aggregates multiple data domains — monitor parallel query load

---

## Duplicate Requests

Look for cases where:
- `useEffect` triggers multiple identical requests
- Stores re-fetch data unnecessarily
- Actions are called repeatedly without state checks

Requests must only run when required.

---

## Fetch in Render

Ensure that:
- API calls do not occur inside component render bodies
- Requests are triggered through stores or controlled effects only

---

## Dashboard Load

Verify that the dashboard does not trigger excessive parallel queries.

Prefer:
- Consolidated queries
- Shared state between sections
- Cached results within the same session

---

## Query Boundaries

Ensure queries include proper constraints:
- Missing filters
- Lack of result limits
- Large uncontrolled result sets

---

## Concurrency Risks

Identify potential race conditions such as:
- Overlapping updates to the same entity
- Outdated responses overriding newer state
- Multiple concurrent requests for the same data
- Requests completing after logout and applying state to the wrong session

---

## Severity Classification

**High**
- Repeated or duplicate requests on every render
- Race conditions on session change
- Uncontrolled or unbounded queries

**Medium**
- Inefficient data fetching patterns
- Heavy in-memory calculations that could be offloaded
- Unnecessary parallel queries on dashboard load

**Low**
- Minor query optimizations
- Cosmetic performance improvements

## Output expectation

Report:
1. fetching patterns that are correct
2. duplicate or excessive requests found
3. race condition risks
4. recommended optimizations