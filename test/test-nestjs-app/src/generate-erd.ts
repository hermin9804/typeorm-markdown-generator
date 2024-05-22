import { TypeormMarkdownGenerator } from '../../../src/TypeormMarkdownGenerator';

const main = async () => {
  try {
    const typeormMarkdown = new TypeormMarkdownGenerator({
      type: 'sqlite',
      database: 'db.sqlite',
      entityPath: 'src/entities/**/*.ts',
      title: 'TypeORM Markdown',
      outFilePath: 'docs/database.md',
    });
    await typeormMarkdown.build();
    console.log('Document generated successfully.');
  } catch (error) {
    console.error('Error generating document:', error);
  }
};

main();
