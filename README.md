# TypeORM Markdown Generator

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

// Enter your TypeORM database configuration here.
const appDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "your_username",
  password: "your_password",
  database: "your_database",
  // entities: [User, PostComment, Post, Category, Profile], or
  entities: [__dirname + "/entities/*.entity{.ts,.js}"],
});

const generateErd = async () => {
  try {
    const typeormMarkdown = new TypeormMarkdownGenerator(appDataSource, {
      // Path to your entity files, starting from the project root.
      entityPath: "src/entities/*.ts",
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

- `/** */` : General JSDoc comments.
- `@namespace <name>`: Both ERD and markdown content
- `@erd <name>`: Only ERD.
- `@describe <name>`: Only markdown content.
- `@hidden`: Neither ERD nor markdown content.
- `@minitems 1`: Mandatory relationship when 1: N (||---|{).

> if @namespace, @erd, @describe, and @hidden are not defined, the entity will be placed in the `Default` namespace.

```ts
/**
 * Both description and ERD on User chatper.
 * Also, only ERD on Post and ShoppingMall chapters.
 * @namespace User
 * @erd Post
 * @erd ShoppingMall
 */
@Entity()
export class User {}

/**
 * Only description on User chapter.
 * @describe User
 */
@Entity()
export class Profile {}

/**
 * Only ERD on Post chapter.
 * @erd Post
 */
@Entity()
export class Comment {}

/**
 * Both description and ERD on ShoppingMall chatper.
 * @namespace ShoppingMall
 */
@Entity()
export class Order {
  /**
   * The tag "minItems 1" means mandatory relationship `||---|{`.
   * Otherwise, no tag means optional relationship `||---o{`.
   * @minitems 1
   */
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems!: OrderItem[];
}

/**
 * Never be shown.
 * @hidden
 */
@Entity()
export class Group {}
```

### Example Entities

- [Example Entities](https://github.com/hermin9804/typeorm-markdown-generator/tree/main/test/test-nestjs-app/src/entities)
