# Skill: Layer Boundary Guard

Use this skill to enforce strict separation between architectural layers in Equilibra.

## Purpose

Protect the project from boundary erosion by ensuring that UI, state, services, and infrastructure each remain within their intended responsibilities.

## Project context

Equilibra follows a layered architecture with the expected flow:

UI  
↓  
Feature Components  
↓  
Store  
↓  
Services  
↓  
Core API / Supabase  
↓  
Database

This flow must remain stable as the project evolves.

## Validate

- UI is limited to presentation and interaction
- Feature components do not access persistence directly
- Stores coordinate state and feature actions
- Services isolate data access
- Core contains infrastructure and technical integration details
- Shared UI remains domain-agnostic
- Feature-specific logic remains inside the correct domain

## Warning signs

- UI importing persistence clients directly
- Stores containing infrastructure-specific details
- Services formatting UI output
- Shared components becoming domain-specific
- Cross-layer imports that bypass the intended flow
- Business rules leaking into presentational components

## Output expectation

State:

1. which boundaries are respected
2. which boundaries are being violated
3. what architectural erosion risks exist
4. what should be corrected while preserving current structure