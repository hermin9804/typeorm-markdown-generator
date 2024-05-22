import { DataSourceOptions } from 'typeorm';

export const mysqlConfig: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'your_username',
  password: 'your_password',
  database: 'your_database',
  entities: [__dirname + '/entities/*.entity{.ts,.js}'],
  synchronize: true,
};

export const postgresConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'your_username',
  password: 'your_password',
  database: 'your_database',
  entities: [__dirname + '/entities/*.entity{.ts,.js}'],
  synchronize: true,
};

export const sqliteConfig: DataSourceOptions = {
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [__dirname + '/entities/*.entity{.ts,.js}'],
  synchronize: true,
};
