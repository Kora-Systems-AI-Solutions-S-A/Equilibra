# Skill: Safe UI Composition

Use this skill to validate that UI composition is safe, maintainable, and aligned with separation of concerns.

## Purpose

Protect the frontend from becoming a dumping ground for business logic, persistence logic, and fragile composition patterns.

## Project Context

- State is managed via **Zustand stores** — components read from stores, never from Supabase directly
- User feedback is handled exclusively via the **toast notification system** (`notification.store.ts`) — do not introduce alternative patterns
- Animations use **Framer Motion** — keep motion purposeful and consistent
- **Empty states** must be handled explicitly in all data-dependent sections

## Validate

- Components have a clear single purpose
- Composition is readable and predictable
- Reusable pieces are extracted when justified
- Presentational components stay presentational
- Complex logic is delegated outside the UI layer
- Props remain understandable and not overly coupled
- Empty states are handled in every data-dependent component
- User feedback (success, error, loading) is always communicated via the toast system

## Warning signs

- Large components doing too many things
- UI components making business decisions
- Deep prop drilling caused by poor boundaries
- Repeated UI composition with hidden variations
- Reusable components with too many flags and conditions
- Missing empty state handling in lists or dashboards
- Custom inline feedback patterns instead of using the toast system
- Direct Supabase calls inside components

## Output expectation

Explain:
1. composition strengths
2. unsafe or fragile areas
3. simplification opportunities
4. missing empty states or feedback patterns
5. whether extraction is justified