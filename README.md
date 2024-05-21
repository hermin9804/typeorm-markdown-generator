# TypeORM Markdown Generator

## Overview

This project was inspired by [prisma-markdown](https://github.com/samchon/prisma-markdown).

The TypeORM Markdown Generator creates markdown documentation for TypeORM entities, featuring ERD diagrams, jsDoc descriptions, and organized content.

## Features

- **Mermaid ERD Diagrams**: Automatically generate Entity-Relationship Diagrams (ERDs) for visual representation of your database schema.
- **jsDoc Comments**: Extract and include jsDoc comments from your TypeORM entities for detailed descriptions.
- **Namespace Separations**: Organize your documentation by namespaces using `@namespace` comments.

## Example Output

- https://github.com/hermin9804/typeorm-markdown/blob/main/erd.md

## Setup

To set up and use the TypeORM Markdown Documents Generator, follow these steps:

1. **Install Dependencies**:

```sh
npm i typeorm-markdown-generator
```

2. **Configuration**:

```ts
// src/generate-erd.ts
import { DataSource } from "typeorm";
import { TypeormMarkdownGenerator } from "typeorm-markdown-generator";

const entityPath = "src/database/entities/*.entity.ts";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "your_username",
  password: "your_password",
  database: "your_database",
  entities: [entityPath],
});

const main = async () => {
  const typeormMarkdown = new TypeormMarkdownGenerator(
    AppDataSource,
    entityPath
  );
  typeormMarkdown
    .build("erd.md")
    .then(() => {
      console.log("Document generated successfully.");
    })
    .catch((error) => {
      console.error("Error generating document:", error);
    });
};

main();
```

3. **Compile**:

```sh
tsc
```

4. **Run**:

```sh
node dist/generate-erd.js
```

## Entity Naming Rule

The naming of the entities in the generated markdown follows these rules:

- If an entity name is defined, the specified name is used.

```ts
@Entity("custom_entity_name")
export class CustomEntityName {
  //...
}
```

- If an entity name is not defined, the entity class name is converted to snake_case and used as the entity name.

```ts
@Entity()
export class DefaultEntityName {
  //...
}
// will be converted to "default_entity_name"
```

## Comment Tags

Use the following comment tags in your TypeORM entities to generate descriptive documentation:

- `/** */` for general jsDoc comments.
- `@namespace <name>`: Both ERD and markdown content
- (todo)`@erd <name>`: Only ERD
- (todo)`@describe <name>`: Only markdown content
- (todo)`@hidden`: Neither ERD nor markdown content
- (todo)`@minItems 1`: Mandatory relationship when 1: N (||---|{)

```ts
/**
 * Represents a user in the system.
 * @namespace User
 */
@Entity("users")
export class User {
  /**
   * The unique identifier for a user.
   */
  @PrimaryGeneratedColumn()
  id: number;
  /**
   * The name of the user.
   */
  @Column()
  name: string;
  /**
   * The email address of the user.
   */
  @Column()
  email: string;
  /**
   * A user's profile.
   */
  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;
}
```
