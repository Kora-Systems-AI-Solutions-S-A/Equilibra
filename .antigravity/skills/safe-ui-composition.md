# Skill: Safe UI Composition

Use this skill to validate that UI composition is safe, maintainable, and aligned with separation of concerns.

## Purpose

Protect the frontend from becoming a dumping ground for business logic, persistence logic, and fragile composition patterns.

## Validate

- Components have a clear single purpose
- Composition is readable and predictable
- Reusable pieces are extracted when justified
- Presentational components stay presentational
- Complex logic is delegated outside the UI layer
- Props remain understandable and not overly coupled

## Warning signs

- Large components doing too many things
- UI components making business decisions
- Deep prop drilling caused by poor boundaries
- Repeated UI composition with hidden variations
- Reusable components with too many flags and conditions

## Output expectation

Explain:
1. composition strengths
2. unsafe or fragile areas
3. simplification opportunities
4. whether extraction is justified