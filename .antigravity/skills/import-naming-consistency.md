# Skill: Import Naming Consistency

Use this skill to validate import paths, naming consistency, and project-wide readability.

## Purpose

Keep imports, file references, and symbol names predictable and aligned with the project conventions.

## Project Conventions

- **Domain Models** use camelCase (e.g. `MonthlyRecord`, `DebtPlan`, `Investment`)
- **DTOs** use snake_case (e.g. `CreateMonthlyRecordRequest`, `CreateDebtPlanRequest`)
- **Stores** are named `[domain].store.ts`
- **Services** are named `[domain].service.ts`
- **Mappers** are colocated with services or in a dedicated mappers file
- Components live in the UI layer and should not import from service files directly

## Validate

- Alias usage follows project standard
- Import paths are stable and intentional
- Names are descriptive and consistent
- Similar concepts use similar naming patterns
- Files and symbols reflect their responsibility clearly
- Store imports are not used directly inside service files
- Service imports are not used directly inside UI components

## Warning signs

- Mixed alias and relative imports without reason
- Inconsistent naming for similar modules (e.g. `debtService` vs `debtPlansService`)
- Generic names that hide responsibility (e.g. `utils.ts`, `helpers.ts`)
- Misleading file names that don't reflect their actual responsibility
- UI components importing directly from service files
- snake_case domain model names in UI files
- camelCase DTO names in service files

## Output expectation

Report:
1. naming consistency wins
2. inconsistent names or imports
3. confusing or misleading terminology
4. suggested standardization aligned with project conventions