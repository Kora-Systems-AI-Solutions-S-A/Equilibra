# Skill: Responsive Review

Use this skill to validate responsiveness, adaptive layout behavior, and usability across screen sizes.

## Purpose

Ensure the interface remains clear, balanced, and usable from small screens to large displays.

## Project Context

- The application is a **personal finance dashboard** — data density must be balanced with readability
- **Bottom Navigation** for mobile has been deliberately deferred to a future phase — do not suggest it as an immediate fix
- Known mobile fixes already applied: grid responsiveness, label overflow, export button overflow
- Tailwind CSS breakpoints are used for responsive layout

## Validate

- Layout adapts intentionally across breakpoints
- Cards and sections reorganize logically on smaller screens
- Spacing scales well without becoming cramped or excessive
- Content density remains readable at all sizes
- No awkward empty areas or overflow issues
- Interactive elements remain accessible and usable on touch devices
- Labels, buttons, and text do not overflow their containers
- Dashboard grids collapse to single column on mobile correctly

## Warning signs

- Layout that only works well at one size
- Excessive empty space on large screens
- Cramped or overflowing content on smaller screens
- Broken visual hierarchy at certain widths
- Components that resize without preserving balance
- Labels or buttons clipped or truncated unexpectedly
- Touch targets too small for mobile interaction

## Output expectation

State:
1. strengths of current responsiveness
2. weak breakpoints or behaviors
3. layout imbalance or overflow issues
4. recommended adaptive adjustments
5. whether the issue is critical or a polish improvement