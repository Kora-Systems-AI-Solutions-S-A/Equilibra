# Antigravity AI Layer

This directory defines the **AI-assisted engineering layer** used in the project.

It contains **Agents** and **Skills** that guide AI tools (such as Antigravity, Gemini or Copilot) to generate code aligned with the system architecture.

The structure separates:

- **generic reusable rules**
- **project-specific rules**

This allows the layer to be reused across multiple projects while maintaining **architectural consistency, predictable behaviour, and high code quality**.

---

# Structure

.antigravity
│
├─ agents  
│  Generic engineering roles reusable across projects  
│
├─ skills  
│  Reusable technical capabilities used by agents  
│
├─ projects  
│  Project-specific configurations  
│
└─ README.md  
   Documentation for the AI automation layer  

---

# Agents

Agents represent **specialized software engineering roles**.

They guide AI tools on **how changes should be implemented**, ensuring the existing architecture is respected.

Agents **do not enforce rules by themselves** — they rely on **skills** to evaluate scenarios and propose safe implementations.

---

## architect-agent

Responsible for **architectural decisions**.

Analyzes:

- where new functionality should live
- which architectural layer should contain the code
- structural consistency of the project
- coupling between modules
- separation of responsibilities

Avoids unnecessary architectural changes.

---

## frontend-agent

Specialized in the **UI layer**.

Responsible for:

- UI implementation
- component organization
- safe component composition
- respecting the design system
- visual consistency
- integration with state management
- Framer Motion animations
- toast notification patterns

---

## data-agent

Specialized in **data flow and persistence**.

Responsible for:

- Supabase integration and query safety
- data modeling and schema design
- separation between UI and data layer
- validating data flow consistency
- mapper contracts (camelCase ↔ snake_case)
- RLS policy validation

---

## refactor-agent

Responsible for **improving existing code structure**.

Focuses on:

- removing duplication
- simplifying logic
- improving readability
- safely reorganizing code

Without changing functional behaviour or security patterns.

---

## ux-reviewer-agent

Responsible for **user experience evaluation**.

Analyzes:

- visual consistency
- information hierarchy
- responsiveness
- animations and transitions
- interaction clarity
- empty states and user feedback

---

# Skills

Skills represent **reusable technical capabilities**.

Agents use them to apply **specific technical rules** during analysis or implementation.

Each skill defines **evaluation criteria** that can be reused across different scenarios.

---

## architecture-placement

Defines the correct architectural layer for new functionality.

Prevents:

- business logic inside UI
- incorrect layering
- tight coupling between modules

---

## safe-ui-composition

Defines best practices for composing UI components.

Ensures:

- reusable components
- separation between layout and logic
- predictable component structure
- empty states handled explicitly
- toast system used for all user feedback

---

## data-flow-segregation

Defines the correct separation between:

- UI
- state management
- services
- data layer

Validates mapper contracts and prevents mixing responsibilities across layers.

---

## responsive-review

Evaluates how the application behaves across different screen sizes.

Ensures visual consistency, readability, and correct layout behavior at all breakpoints.

---

## motion-review

Analyzes UI animations and transitions using Framer Motion.

Checks:

- motion consistency
- performance impact
- visual experience quality

---

## security-review

Reviews application security boundaries.

Prevents:

- sensitive data exposure
- unsafe queries
- missing RLS policies
- `user_id` sourced from UI instead of auth session

---

## load-review

Performs a **performance and request load audit**.

Focuses on:

- excessive API or database requests
- duplicate queries
- race conditions
- performance bottlenecks
- incorrect request patterns

---

## multi-user-isolation-review

Audits **multi-user safety and tenant isolation**.

Ensures:

- user data cannot leak between sessions
- stores reset correctly on logout and auth state change
- services properly scope queries by user
- session transitions are safe
- multiple browser tabs remain consistent

This skill is critical for **multi-tenant SaaS applications**.

---

## import-naming-consistency

Ensures consistency of:

- import aliases
- naming conventions
- module organization

Helps keep the codebase predictable and easy to navigate.

---

# Projects

Each project can define **project-specific configuration**.

Typical structure:

projects/  
  equilibra/

Inside this folder live:

- project context
- architectural rules
- project-specific agents
- domain-specific skills
- brain-map.md

This separation allows the AI layer to be reused across different projects.

---

# Agent Responsibilities

Agents must:

- respect the existing architecture
- prefer incremental changes
- avoid unnecessary structural modifications
- maintain clear separation of responsibilities

Agents **must not alter the project architecture unless explicitly requested**.

Structural changes should only occur when directly instructed.

---

# AI Loading Order

When an AI tool works within this repository, the recommended loading sequence is:

1. Read this README
2. Load **generic agents**
3. Load **relevant skills**
4. Identify the active project inside `/projects`
5. Load the project files:
   - `project-context.md`
   - `project-rules.md`
   - `brain-map.md`
6. Apply these rules before generating code

This ensures the AI understands first:

1. engineering roles  
2. technical capabilities  
3. project-specific context  

---

# Philosophy

This layer exists to ensure:

- consistent architecture
- predictable code generation
- clear separation of responsibilities
- easier project evolution
- safe collaboration between humans and AI

The goal is for AI tools to behave as **engineering assistants**, respecting the system design rather than introducing arbitrary solutions.