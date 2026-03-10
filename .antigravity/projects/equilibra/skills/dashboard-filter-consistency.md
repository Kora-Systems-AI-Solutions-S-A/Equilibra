# Skill: Dashboard Filter Consistency

Use this skill to review whether filters, summaries, and aggregations in the Equilibra dashboard remain consistent across financial domains.

## Purpose

Ensure that dashboard filters and summarized values behave predictably and consistently across cards, views, and financial indicators.

## Project context

Equilibra's dashboard is a consolidated financial view composed of multiple independent domain cards, including:

- debt planning
- income
- monthly summary
- investments

Although the dashboard is visually unified, the underlying domains remain logically separated.

## Validate

- Filters are conceptually consistent across cards
- Time-based views use compatible assumptions
- Aggregated values are coherent with the selected context
- Summary cards do not silently use different scopes
- Visual filtering behavior matches actual data behavior
- Domain-specific cards preserve their own logic without contradicting shared dashboard context

## Warning signs

- Cards reacting differently to what appears to be the same filter
- Monthly summaries using different date assumptions from other widgets
- Dashboard context being applied inconsistently across domains
- Aggregated totals that cannot be explained by visible filters
- Cards using hidden local rules that break dashboard predictability

## Output expectation

Explain:

1. whether the dashboard context is consistent
2. where filters or scopes diverge
3. which inconsistencies may confuse the user
4. what should be aligned conceptually or technically