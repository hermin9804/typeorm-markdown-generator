# typeorm markdown generator

## table of contents

1. [overview](#overview)
2. [features](#features)
3. [example output](#example-output)
4. [setup](#setup)
5. [entity naming rule](#entity-naming-rule)
6. [comment tags](#comment-tags)
7. [configuration examples for other databases](#configuration-examples-for-other-databases)

## overview

this project was inspired by [prisma-markdown](https://github.com/samchon/prisma-markdown).

the typeorm markdown generator creates markdown documentation for typeorm entities, featuring erd diagrams, jsdoc descriptions, and organized content.

## features

- **mermaid erd diagrams**: automatically generate entity-relationship diagrams (erds) for visual representation of your database schema.
- **jsdoc comments**: extract and include jsdoc comments from your typeorm entities for detailed descriptions.
- **namespace separations**: organize your documentation by namespaces using `@namespace` comments.

## example output

- https://github.com/hermin9804/typeorm-markdown/blob/main/erd.md

## setup

to set up and use the typeorm markdown documents generator, follow these steps:

### install dependencies

```sh
npm i -d typeorm-markdown-generator
```

### configuration

create a `typeorm-markdown.json` configuration file in the ==root of your project==. below is an example configuration for sqlite:

#### sqlite example

- **type**: database type (required)
- **database**: path to your database file (required)
- **entitypath**: typeorm entity path (required)
- **outfilepath**: output file path (optional, default: docs/erd.md)
- **title**: markdown title (optional, default: erd)

```json
{
  "type": "sqlite",
  "database": "path/to/your_database.sqlite",
  "entitypath": "src/database/entities/*.entity.ts",
  "title": "erd",
  "outfilepath": "doc/erd.md"
}
```

for configuration examples for other databases, see [configuration examples for other databases](#configuration-examples-for-other-databases).

### run

```sh
npx typeorm-markdown
```

## entity naming rule

the naming of the entities in the generated markdown follows these rules:

- if an entity name is defined, the specified name is used.

```ts
@entity("custom_entity_name")
export class customentityname {
  //...
}
```

- if an entity name is not defined, the entity class name is converted to snake_case and used as the entity name.

```ts
@entity()
export class defaultentityname {
  //...
}
// will be converted to "default_entity_name"
```

## comment tags

use the following comment tags in your typeorm entities to generate descriptive documentation:

- `/** */` for general jsdoc comments.
- `@namespace <name>`: both erd and markdown content
- (todo)`@erd <name>`: only erd
- (todo)`@describe <name>`: only markdown content
- (todo)`@hidden`: neither erd nor markdown content
- (todo)`@minitems 1`: mandatory relationship when 1: n (||---|{)

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

## configuration examples for other databases

### postgresql

- **type**: database type (required)
- **host**: database host (required)
- **port**: database port (required)
- **username**: database user name (required)
- **password**: database password (required)
- **database**: database name (required)
- **entitypath**: typeorm entity path (required)
- **outfilepath**: output file path (optional, default: docs/erd.md)
- **title**: markdown title (optional, default: erd)

```json
{
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "your_username",
  "password": "your_password",
  "database": "your_database",
  "entitypath": "src/database/entities/*.entity.ts",
  "title": "erd",
  "outfilepath": "doc/erd.md"
}
```

### mysql/mariadb

- **type**: database type (required)
- **host**: database host (required)
- **port**: database port (required)
- **username**: database user name (required)
- **password**: database password (required)
- **database**: database name (required)
- **entitypath**: typeorm entity path (required)
- **outfilepath**: output file path (optional, default: docs/erd.md)
- **title**: markdown title (optional, default: erd)

```json
{
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "your_username",
  "password": "your_password",
  "database": "your_database",
  "entitypath": "src/database/entities/*.entity.ts",
  "title": "erd",
  "outfilepath": "doc/erd.md"
}
```

### sqlite

- **type**: database type (required)
- **database**: path to your database file (required)
- **entitypath**: typeorm entity path (required)
- **outfilepath**: output file path (optional, default: docs/erd.md)
- **title**: markdown title (optional, default: erd)

```json
{
  "type": "sqlite",
  "database": "path/to/your_database.sqlite",
  "entitypath": "src/database/entities/*.entity.ts",
  "title": "erd",
  "outfilepath": "doc/erd.md"
}
```

### oracle

- **type**: database type (required)
- **host**: database host (required)
- **port**: database port (required)
- **username**: database user name (required)
- **password**: database password (required)
- **database**: database name (required)
- **entitypath**: typeorm entity path (required)
- **outfilepath**: output file path (optional, default: docs/erd.md)
- **title**: markdown title (optional, default: erd)

```json
{
  "type": "oracle",
  "host": "localhost",
  "port": 1521,
  "username": "your_username",
  "password": "your_password",
  "database": "your_database",
  "entitypath": "src/database/entities/*.entity.ts",
  "title": "erd",
  "outfilepath": "doc/erd.md"
}
```

### mssql

- **type**: database type (required)
- **host**: database host (required)
- **port**: database port (required)
- **username**: database user name (required)
- **password**: database password (required)
- **database**: database name (required)
- **entitypath**: typeorm entity path (required)
- **outfilepath**: output file path (optional, default: docs/erd.md)
- **title**: markdown title (optional, default: erd)

```json
{
  "type": "mssql",
  "host": "localhost",
  "port": 1433,
  "username": "your_username",
  "password": "your_password",
  "database": "your_database",
  "entitypath": "src/database/entities/*.entity.ts",
  "title": "erd",
  "outfilepath": "doc/erd.md"
}
```

### mongodb

- **type**: database type (required)
- **host**: database host (required)
- **port**: database port (required)
- **username**: database user name (required)
- **password**: database password (required)
- **database**: database name (required)
- **usenewurlparser**: use new url parser (required)
- **useunifiedtopology**: use unified topology (required)
- **entitypath**: typeorm entity path (required)
- **outfilepath**: output file path (optional, default: docs/erd.md)
- **title**: markdown title (optional, default: erd)

```json
{
  "type": "mongodb",
  "host": "localhost",
  "port": 27017,

  "username": "your_username",
  "password": "your_password",
  "database": "your_database",
  "usenewurlparser": true,
  "useunifiedtopology": true,
  "entitypath": "src/database/entities/*.entity.ts",
  "title": "erd",
  "outfilepath": "doc/erd.md"
}
```
