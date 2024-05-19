import "reflect-metadata";
import { DataSource } from "typeorm";
import { MermaidErd } from "./mermaid-erd";
import { extractRelations, fetchEntityMetadata } from "./entity-metadata-utils";
import { TableFactory } from "./table-factory";

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: ["src/entities/*.entity.ts"],
});

// AppDataSource.initialize()
//   .then(async (connection) => {
//     const metadataBuilder = new MetadataBuilder(connection);
//     const entityMetadata = await metadataBuilder.getEntityMetadata();
//     const relationData = metadataBuilder.getRelations(entityMetadata);

//     console.log("Entity Metadata:", entityMetadata);
//     console.log("Relation Data:", relationData);
//   })
//   .catch((error) => console.log(error));

// AppDataSource.initialize()
//   .then(async (connection) => {
//     const mermaidErd = new MermaidErd(connection);
//     await mermaidErd.initialize();
//     const erdDiagram = mermaidErd.render();

//     console.log(erdDiagram);
//   })
//   .catch((error) => console.log(error));

const main = async () => {
  const connection = await AppDataSource.initialize();
  const tableFactory = new TableFactory(connection);
  const tables = await tableFactory.getTables();
  const mermaidErd = new MermaidErd(tables);
  const erdDiagram = mermaidErd.render();
  console.log(erdDiagram);
};

main();
