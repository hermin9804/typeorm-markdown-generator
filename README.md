# TypeORM Markdown Generator

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Example Output](#example-output)
4. [Setup](#setup)
5. [Custom Configuration File Path](#custom-configuration-file-path)
6. [Entity Naming Rule](#entity-naming-rule)
7. [Comment Tags](#comment-tags)
8. [Configuration Examples for Other Databases](#configuration-examples-for-other-databases)

## Overview

This project was inspired by [prisma-markdown](https://github.com/samchon/prisma-markdown).

The TypeORM Markdown Generator creates markdown documentation for TypeORM entities, featuring ERD diagrams, JSDoc descriptions, and organized content.

## Features

- **Mermaid ERD Diagrams**: Automatically generate entity-relationship diagrams (ERDs) for visual representation of your database schema.
- **JSDoc Comments**: Extract and include JSDoc comments from your TypeORM entities for detailed descriptions.
- **Namespace Separations**: Organize your documentation by namespaces using `@namespace` comments.

## Example Output

- [Example Output](https://github.com/hermin9804/typeorm-markdown/blob/main/erd.md)

## Setup

To set up and use the TypeORM Markdown Documents Generator, follow these steps:

### Install Dependencies

```sh
npm i -D typeorm-markdown-generator
```

### Configuration

By default, the TypeORM Markdown Generator looks for a configuration file named `typeorm-markdown.json` in the root of your project. Below is an example configuration for PostgreSQL:

### PostgreSQL

- **type**: Database type (required)
- **host**: Database host (required)
- **port**: Database port (required)
- **username**: Database user name (required)
- **password**: Database password (required)
- **database**: Database name (required)
- **entitypath**: TypeORM entity path (required)
- **outfilepath**: Output file path (optional, default: docs/erd.md)
- **title**: Markdown title (optional, default: ERD)

```json
{
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "your_username",
  "password": "your_password",
  "database": "your_database",
  "entitypath": "src/database/entities/*.entity.ts",
  "title": "ERD",
  "outfilepath": "docs/erd.md"
}
```

For configuration examples for other databases, see [Configuration Examples for Other Databases](#configuration-examples-for-other-databases).

### Run

```sh
npx typeorm-markdown
```

## Custom Configuration File Path

By default, the TypeORM Markdown Generator looks for a configuration file named `typeorm-markdown.json` in the root of your project. However, you can specify a custom configuration file path using the `-c` or `--config` option when running the generator. This is useful if you have multiple configurations or prefer a different file name.

### Usage

To use a custom configuration file, pass the `-c` or `--config` option followed by the path to your configuration file.

```sh
npx typeorm-markdown -c path/to/your_custom_config.json
```

### Example

```sh
npx typeorm-markdown -c configs/typeorm-custom-config.json
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

## Configuration Examples for Other Databases

### PostgreSQL

- **type**: Database type (required)
- **host**: Database host (required)
- **port**: Database port (required)
- **username**: Database user name (required)
- **password**: Database password (required)
- **database**: Database name (required)
- **entitypath**: TypeORM entity path (required)
- **outfilepath**: Output file path (optional, default: docs/erd.md)
- **title**: Markdown title (optional, default: ERD)

```json
{
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "your_username",
  "password": "your_password",
  "database": "your_database",
  "entitypath": "src/database/entities/*.entity.ts",
  "title": "ERD",
  "outfilepath": "docs/erd.md"
}
```

### MySQL/MariaDB

- **type**: Database type (required)
- **host**: Database host (required)
- **port**: Database port (required)
- **username**: Database user name (required)
- **password**: Database password (required)
- **database**: Database name (required)
- **entitypath**: TypeORM entity path (required)
- **outfilepath**: Output file path (optional, default: docs/erd.md)
- **title**: Markdown title (optional, default: ERD)

```json
{
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "your_username",
  "password": "your_password",
  "database": "your_database",
  "entitypath": "src/database/entities/*.entity.ts",
  "title": "ERD",
  "outfilepath": "docs/erd.md"
}
```

### SQLite

- **type**: Database type (required)
- **database**: Path to your database file (required)
- **entitypath**: TypeORM entity path (required)
- **outfilepath**: Output file path (optional, default: docs/erd.md)
- **title**: Markdown title (optional, default: ERD)

```json
{
  "type": "sqlite",
  "database": "path/to/your_database.sqlite",
  "entitypath": "src/database/entities/*.entity.ts",
  "title": "ERD",
  "outfilepath": "docs/erd.md"
}
```
