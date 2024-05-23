# TypeORM Markdown Generator

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Example Output](#example-output)
- [Setup](#setup)
- [Entity Naming Rule](#entity-naming-rule)
- [Comment Tags](#comment-tags)

## Overview

This project was inspired by [prisma-markdown](https://github.com/samchon/prisma-markdown).

The TypeORM Markdown Generator creates markdown documentation for TypeORM entities, featuring ERD diagrams, JSDoc descriptions, and organized content.

## Features

- **Mermaid ERD Diagrams**: Automatically generate entity-relationship diagrams (ERDs) for visual representation of your database schema.
- **JSDoc Comments**: Extract and include JSDoc comments from your TypeORM entities for detailed descriptions.
- **Namespace Separations**: Organize your documentation by namespaces using `@namespace` comments.

## Example Output

- [with posgres](https://github.com/hermin9804/typeorm-markdown-generator/blob/main/test/test-nestjs-app/docs/postgres-erd.md)
- [with mysql](https://github.com/hermin9804/typeorm-markdown-generator/blob/main/test/test-nestjs-app/docs/mysql-erd.md)
- [with sqlite](https://github.com/hermin9804/typeorm-markdown-generator/blob/main/test/test-nestjs-app/docs/sqlite-erd.md)

## Setup

### Install Dependencies

To set up and use the TypeORM Markdown Documents Generator, follow these steps:

```shell
npm install --save-dev typeorm-markdown-generator
```

### Configuration

Create `src/generate-erd.ts` file:

```ts
// src/generate-erd.ts
import { DataSource } from "typeorm";
import { TypeormMarkdownGenerator } from "typeorm-markdown-generator";

const appDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "your_username",
  password: "your_password",
  database: "your_database",
  entities: [__dirname + "/entities/*.entity{.ts,.js}"],
}); // Enter your TypeORM database configuration here.

const generateErd = async () => {
  try {
    const typeormMarkdown = new TypeormMarkdownGenerator(appDataSource, {
      // Path to your entity files, starting from the project root.
      entityPath: "src/entities/**/*.ts",
      // Title of the document.
      title: "Postgres TypeORM Markdown",
      // Path to save the document, starting from the project root.
      outFilePath: "docs/postgres-erd.md",
    });
    await typeormMarkdown.build();
    console.log("Document generated successfully.");
  } catch (error) {
    console.error("Error generating document:", error);
  }
};

generateErd();
```

Note: The `TypeormMarkdownGenerator` internally sets the project root path to the location of the `package.json` file.

### Compile

```sh
tsc
```

### Run

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

- `/** */` for general JSDoc comments.
- `@namespace <name>`: Both ERD and markdown content.
- (TODO) `@erd <name>`: Only ERD.
- (TODO) `@describe <name>`: Only markdown content.
- (TODO) `@hidden`: Neither ERD nor markdown content.
- (TODO) `@minitems 1`: Mandatory relationship when 1: N (||---|{).

```ts
/**
 * User entity represents a user in the application.
 * @namespace User
 */
@Entity()
export class User {
  /**
   * Primary key for the user.
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Username of the user.
   */
  @Column()
  username!: string;

  /**
   * List of posts created by the user.
   */
  @OneToMany(() => Post, (post) => post.user)
  posts!: Post[];

  /**
   * Profile associated with the user.
   */
  @OneToOne(() => Profile, (profile) => profile.user)
  profile!: Profile;
}
```
