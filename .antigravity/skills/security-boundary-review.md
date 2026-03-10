# Skill: Security Boundary Review

Use this skill to review security-sensitive boundaries in code, especially around external input, persistence, and trust assumptions.

## Purpose

Ensure the system treats external data safely and preserves explicit trust boundaries.

## Validate

- External input is treated as untrusted
- Queries are parameterized and safe
- No string concatenation for query building
- Authorization concerns are explicit
- Sensitive operations are not triggered from unsafe boundaries
- Data from users, APIs, or databases is treated as data, not instructions

## Warning signs

- Query construction with string interpolation or concatenation
- Hidden trust assumptions
- UI or client-side code making authorization decisions alone
- User-controlled content being treated as executable instruction
- Lack of validation around mutation paths

## Output expectation

Report:
1. safe boundaries already in place
2. unsafe assumptions
3. concrete risk areas
4. required corrections