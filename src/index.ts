import fs from "fs";
import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import { MermaidErd } from "./mermaid-erd";
import { TableFactory } from "./table-factory";
import { EntityDocumentFactory } from "./entity-document-factory";
import { AggregateFactory } from "./aggregate-factory";
import { Markdown } from "./markdown";

const entityPath = "src/examples/basic/entities/*.entity.ts";

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [entityPath],
});

const main = async () => {
  const connection = await AppDataSource.initialize();

  // const mermaidErd = new MermaidErd(tables);
  // const erdDiagram = mermaidErd.render();

  const tableFactory = new TableFactory(connection);
  const tables = await tableFactory.getTables();
  // fs.writeFileSync("tables.json", JSON.stringify(tables, null, 2));

  // const entityDocumentFactory = new EntityDocumentFactory(entityPath);
  // const entityDocuments = entityDocumentFactory.createEntityDocument();
  // fs.writeFileSync(
  //   "entity-documents.json",
  //   JSON.stringify(entityDocuments, null, 2)
  // );

  const aggregateFactory = new AggregateFactory(entityPath, connection);
  const aggregates = await aggregateFactory.createAggregates();
  // fs.writeFileSync("aggregates.json", JSON.stringify(aggregates, null, 2));

  // aggregates.forEach((aggregate) => {
  //   const mermaidErd = new MermaidErd(aggregate.tables);
  //   const erdDiagram = mermaidErd.render();
  // });

  const markdown = new Markdown(aggregates);
  const markdownContent = markdown.render();
  fs.writeFileSync("erd.md", markdownContent);
};

main();
