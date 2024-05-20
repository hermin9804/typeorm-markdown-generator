import fs from "fs";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { MarkdownWriter } from "../writers/MarkdownWriter";
import { EntityDocAnalyzer } from "../analyzers/EntityDocAnalyzer";
import { EntityMetadataAnalyzer } from "../analyzers/EntityMetadataAnalyzer";
import { NamespaceFactory } from "../factorys/NamespaceFactory";

const entityPath = "test/entities/*.entity.ts";

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [entityPath],
});

const main = async () => {
  const connection = await AppDataSource.initialize();

  const entityMetadataAnalyzer = new EntityMetadataAnalyzer(connection);
  const entityDocAnalyzer = new EntityDocAnalyzer(entityPath);

  const tables = await entityMetadataAnalyzer.analyze();
  const entityDocs = entityDocAnalyzer.analyze();

  const nmaespaceFactory = new NamespaceFactory();
  const namespaces = await nmaespaceFactory.create(tables, entityDocs);

  const markdown = new MarkdownWriter(namespaces);
  const markdownContent = markdown.render();
  fs.writeFileSync("erd.md", markdownContent);
};

main();
