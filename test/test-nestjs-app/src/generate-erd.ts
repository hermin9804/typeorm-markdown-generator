import { TypeormMarkdownGenerator } from 'typeorm-markdown-generator';
import { DataSource } from 'typeorm';
import { mysqlConfig, postgresConfig } from './typeorm-config';

const generateErdPostgres = async () => {
  const appDataSources = new DataSource(postgresConfig);

  const typeormMarkdown = new TypeormMarkdownGenerator(appDataSources, {
    entityPath: 'src/entities/**/*.ts',
    title: 'postgres TypeORM Markdown',
    outFilePath: 'docs/postgres-erd.md',
    indexTable: true,
  });
  await typeormMarkdown.build();
  console.log('Posgres Document generated successfully.');
};

const generateErdMysql = async () => {
  const appDataSources = new DataSource(mysqlConfig);

  const typeormMarkdown = new TypeormMarkdownGenerator(appDataSources, {
    entityPath: 'src/entities/**/*.ts',
    title: 'mysql TypeORM Markdown',
    outFilePath: 'docs/mysql-erd.md',
    indexTable: true,
  });
  await typeormMarkdown.build();
  console.log('Mysql Document generated successfully.');
};

const generateErdSqlite = async () => {
  const appDataSources = new DataSource(postgresConfig);

  const typeormMarkdown = new TypeormMarkdownGenerator(appDataSources, {
    entityPath: 'src/entities/**/*.ts',
    title: 'sqlite TypeORM Markdown',
    outFilePath: 'docs/sqlite-erd.md',
    indexTable: true,
  });
  await typeormMarkdown.build();
  console.log('Sqlite Document generated successfully.');
};

generateErdPostgres();
generateErdMysql();
generateErdSqlite();
