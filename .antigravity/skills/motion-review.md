# Skill: Motion Review

Use this skill to review animation and motion decisions in the UI.

## Purpose

Ensure motion improves perceived quality and usability without becoming distracting, heavy, or inconsistent.

## Project Context

- **Framer Motion** is the established animation library — do not suggest alternatives
- Motion is currently used for: **page transitions**, **toast notification animations**, and **UI feedback**
- Motion philosophy: subtle, purposeful, and consistent — never decorative

## Validate

- Motion has a clear purpose (feedback, transition, hierarchy)
- Timing feels smooth and intentional
- Animations do not fight layout changes
- Entry/exit transitions are coherent
- Motion supports hierarchy and feedback
- Performance impact is acceptable
- Framer Motion variants and transitions are consistent across similar components

## Warning signs

- Motion that exists only for decoration
- Delayed UI responsiveness caused by animations
- Mismatched transition timing across similar components
- Janky layout shifts during animation
- Over-animated components that distract from content
- Inconsistent easing or duration across similar interactions
- Animations blocking user interaction

## Output expectation

Describe:
1. what is working well
2. what feels off or inconsistent
3. user impact of problematic motion
4. suggested improvements aligned with Framer Motion patterns