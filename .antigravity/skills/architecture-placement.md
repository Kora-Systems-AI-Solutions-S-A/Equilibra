# Skill: Architecture Placement

Use this skill to validate whether code is being placed in the correct architectural layer.

## Purpose

Ensure that responsibilities are distributed correctly across the project structure and that no layer is doing work that belongs elsewhere.

## Validate

- UI components only handle presentation and interaction
- Stores coordinate state and feature-level orchestration
- Services encapsulate data access and persistence calls
- Core/infrastructure contains technical integration details
- Business rules are not embedded in visual components
- API/database access is not performed directly from UI

## Warning signs

- Components calling API or database directly
- Business decisions inside JSX/render logic
- Services storing UI state
- Store mixing persistence details with UI formatting
- Cross-layer imports that bypass intended boundaries

## Output expectation

State:
1. what is correctly placed
2. what is misplaced
3. what should be moved conceptually
4. whether the current implementation should be accepted or adjusted