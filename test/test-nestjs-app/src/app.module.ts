import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { mysqlConfig, postgresConfig, sqliteConfig } from './typeorm-config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (): Promise<DataSourceOptions> => {
        const dbType = process.env.DB_TYPE || 'postgres';
        console.log(`Using ${dbType} database`);
        switch (dbType) {
          case 'postgres':
            return postgresConfig;
          case 'mysql':
            return mysqlConfig;
          case 'sqlite':
            return sqliteConfig;
          default:
            throw new Error(`Unsupported database type: ${dbType}`);
        }
      },
    }),
  ],
})
export class AppModule {}
