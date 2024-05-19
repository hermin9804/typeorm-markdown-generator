# TypeORM Markdown Documents Generator

## Overview

The TypeORM Markdown Documents Generator is a tool designed to generate comprehensive markdown documentation for your TypeORM entities. This generator provides visual ERD diagrams using Mermaid, detailed descriptions from jsDoc comments, and organized content separated by `@namespace` comments.


## Features

- **Mermaid ERD Diagrams**: Automatically generate Entity-Relationship Diagrams (ERDs) for visual representation of your database schema.
- **jsDoc Comments**: Extract and include jsDoc comments from your TypeORM entities for detailed descriptions.
- **Namespace Separations**: Organize your documentation by namespaces using `@namespace` comments.

## Example Output
 - https://github.com/hermin9804/typeorm-markdown/blob/main/erd.md

## Setup (todo)

To set up and use the TypeORM Markdown Documents Generator, follow these steps:

1. **Install Dependencies**:

2. **Configuration**:
   Configure your TypeORM entities to include jsDoc comments and `@namespace` comments.

## Entity Naming Rule

The naming of the entities in the generated markdown follows these rules:
- If `@Entity("entity_name")` is defined, the specified name is used.
- If `@Entity("entity_name")` is not defined, the entity class name is converted to snake_case and used as the entity name.

## Comment Tags

Use the following comment tags in your TypeORM entities to generate descriptive documentation:
- `/** */` for general jsDoc comments.
- `/** @namespace */` for separating content by namespaces.

## Example Usage (todo)

