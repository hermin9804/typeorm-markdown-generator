import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { exec } from 'child_process';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const dbTypes = ['postgres', 'mysql', 'sqlite'];

  dbTypes.forEach((dbType) => {
    describe(`TypeormMarkdwonGenerator Testing with DB_TYPE=${dbType}`, () => {
      beforeEach(async () => {
        process.env.DB_TYPE = dbType;
        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
      });

      it(`run npx typeorm-markdown -c typeorm-markdown-${dbType}.json`, async () => {
        await runTypeORMMarkdownCommand(dbType);
      });

      afterEach(async () => {
        await app.close();
      });
    });
  });
});

function runTypeORMMarkdownCommand(dbType: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(
      `npx typeorm-markdown -c typeorm-markdown-${dbType}.json`,
      (error, stdout) => {
        if (error) {
          console.error(
            `Error executing typeorm-markdown-${dbType}.json: ${error.message}`,
          );
          reject(error);
        } else {
          console.log(`Output: ${stdout}`);
          resolve();
        }
      },
    );
  });
}
