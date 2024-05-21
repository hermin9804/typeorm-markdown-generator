import { TTypeormMarkdownConfig } from "../structures";

export const DataSourceOptionsErrorMessages: { [key: string]: string } = {
  typeIsRequired: "Database type is required.",
  mysql:
    "ERROR: MySQL/MariaDB configuration requires host, port, username, password, and database fields.",
  mariadb:
    "ERROR: MySQL/MariaDB configuration requires host, port, username, password, and database fields.",
  postgres:
    "ERROR: PostgreSQL configuration requires host, port, username, password, and database fields.",
  sqlite: "ERROR: SQLite configuration requires database field.",
  oracle:
    "ERROR: Oracle configuration requires host, port, username, password, and database fields.",
  mssql:
    "ERROR: MSSQL configuration requires host, port, username, password, and database fields.",
  mongodb:
    "ERROR: MongoDB configuration requires host, port, username, password, database, useNewUrlParser, useUnifiedTopology fields.",
};

export function validateConfig(config: any): config is TTypeormMarkdownConfig {
  if (!config) {
    console.error("Config is required.");
    return false;
  }

  const { type, entityPath, outFilePath, title } = config;

  if (!type) {
    console.error(DataSourceOptionsErrorMessages.typeIsRequired);
    return false;
  }

  switch (type) {
    case "mysql":
    case "mariadb":
      if (
        !config.host ||
        !config.port ||
        !config.username ||
        !config.password ||
        !config.database
      ) {
        console.error(DataSourceOptionsErrorMessages[type]);
        return false;
      }
      break;
    case "postgres":
      if (
        !config.host ||
        !config.port ||
        !config.username ||
        !config.password ||
        !config.database
      ) {
        console.error(DataSourceOptionsErrorMessages[type]);
        return false;
      }
      break;
    case "sqlite":
      if (!config.database) {
        console.error(DataSourceOptionsErrorMessages[type]);
        return false;
      }
      break;
    case "oracle":
      if (
        !config.host ||
        !config.port ||
        !config.username ||
        !config.password ||
        !config.database
      ) {
        console.error(DataSourceOptionsErrorMessages[type]);
        return false;
      }
      break;
    case "mssql":
      if (
        !config.host ||
        !config.port ||
        !config.username ||
        !config.password ||
        !config.database
      ) {
        console.error(DataSourceOptionsErrorMessages[type]);
        return false;
      }
      break;
    case "mongodb":
      if (
        !config.host ||
        !config.port ||
        !config.username ||
        !config.password ||
        !config.database ||
        typeof config.useNewUrlParser !== "boolean" ||
        typeof config.useUnifiedTopology !== "boolean"
      ) {
        console.error(DataSourceOptionsErrorMessages[type]);
        return false;
      }
      break;
    default:
      console.error("Invalid database type.");
      return false;
  }

  if (!entityPath) {
    console.error("Entity path is required.");
    return false;
  }

  return true;
}
