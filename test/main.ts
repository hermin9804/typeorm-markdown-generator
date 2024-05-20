import { DataSource } from "typeorm";
import { TypeormMarkdownBuilder } from "../src/TypeormMarkdownBuilder";

const entityPath = "test/entities/*.entity.ts";

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [entityPath],
});

const main = async () => {
  const typeormMarkdown = new TypeormMarkdownBuilder(AppDataSource, entityPath);
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
