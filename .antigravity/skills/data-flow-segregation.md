# Skill: Data Flow Segregation

Use this skill to validate whether data moves through the system in a clean, predictable, and maintainable way.

## Purpose

Ensure that data flow respects the intended boundaries between UI, state management, services, and persistence.

## Validate

- UI receives data through props, hooks, or store access
- Store orchestrates state and feature actions
- Services handle persistence and external communication
- Data transformations happen in appropriate boundaries
- Source of truth is clear
- The same data is not being duplicated across layers without reason

## Warning signs

- UI transforming data that should arrive already prepared
- Store directly coupled to raw infrastructure details
- Same data shape being rebuilt repeatedly in many places
- Persistence response leaking deeply into UI
- Unclear ownership of loading, error, or mutation state

## Output expectation

Describe:
1. current flow
2. separation quality
3. boundary violations
4. recommended adjustments