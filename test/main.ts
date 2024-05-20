import { DataSource } from "typeorm";
import { TypeormMarkdownGenerator } from "../src/TypeormMarkdownGenerator";
import path from "path";

// const entityPath = path.resolve(__dirname, "../test/entities/*.entity.ts");
const entityPath = "test/entities/*.entity.ts";

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [entityPath],
});

const main = async () => {
  const typeormMarkdown = new TypeormMarkdownGenerator(
    AppDataSource,
    entityPath
  );
  typeormMarkdown
    .build("erd.md")
    .then(() => {
      console.log("Document generated successfully.");
    })
    .catch((error) => {
      console.error("Error generating document:", error);
    });
};

main();
