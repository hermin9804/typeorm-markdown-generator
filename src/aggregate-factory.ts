import { DataSource } from "typeorm";
import { EntityDocumentFactory } from "./entity-document-factory";
import { TableFactory } from "./table-factory";
import { IAggregate, IEntityDocument, ITable } from "./types";

export class AggregateFactory {
  private readonly entityDocumentFactory: EntityDocumentFactory;
  private readonly tableFactory: TableFactory;

  constructor(sourceFilePath: string, dataSource: DataSource) {
    this.entityDocumentFactory = new EntityDocumentFactory(sourceFilePath);
    this.tableFactory = new TableFactory(dataSource);
  }

  public async createAggregates(): Promise<IAggregate[]> {
    const entityDocuments = this.entityDocumentFactory.createEntityDocument();
    const tables = await this.tableFactory.getTables();

    const namespaceMap: Map<string, IEntityDocument[]> = new Map();

    entityDocuments.forEach((entityDocument) => {
      const namespaces = entityDocument.tags
        .filter((tag) => tag.name === "namespace")
        .map((tag) => tag.text);

      if (namespaces.length === 0) {
        namespaces.push("unknown");
      }

      namespaces.forEach((namespace) => {
        if (!namespaceMap.has(namespace)) {
          namespaceMap.set(namespace, []);
        }
        namespaceMap.get(namespace)!.push(entityDocument);
      });
    });

    const result: IAggregate[] = [];

    namespaceMap.forEach((documents, namespace) => {
      const matchingTables = tables.filter((table) =>
        documents.some(
          (doc) => doc.name.toLowerCase() === table.name.toLowerCase()
        )
      );

      result.push({
        namespace,
        documents,
        tables: matchingTables,
      });
    });

    return result;
  }
}

// // Use the AggregateFactory to create aggregates
// const sourceFilePath = "src/entities/*.ts";
// const dataSource = new DataSource({
//   type: "mysql", // or your database type
//   host: "localhost",
//   port: 3306,
//   username: "test",
//   password: "test",
//   database: "test",
//   synchronize: true,
//   logging: false,
//   entities: ["src/entities/**/*.ts"],
// });

// const aggregateFactory = new AggregateFactory(sourceFilePath, dataSource);
// aggregateFactory.createAggregates().then((aggregates) => {
//   fs.writeFileSync("aggregates.json", JSON.stringify(aggregates, null, 2));
// });
