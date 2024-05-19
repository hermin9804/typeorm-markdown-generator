import { DataSource } from "typeorm";
import { EntityDocumentFactory } from "./entity-document-factory";
import { TableFactory } from "./table-factory";
import { IAggregate, ITable } from "./types";

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
    const uniqueNamespaces = this.getUniqueNamespaces(entityDocuments);

    return uniqueNamespaces.map((namespace) => {
      const documentsInNamespace = this.getDocumentsInNamespace(
        entityDocuments,
        namespace
      );
      const matchingTables = this.getMatchingTables(
        documentsInNamespace,
        tables
      );
      const filteredTables = this.filterTableRelations(matchingTables);
      return {
        namespace,
        documents: documentsInNamespace,
        tables: filteredTables,
      };
    });
  }

  private getUniqueNamespaces(entityDocuments: any[]): string[] {
    const namespaces = entityDocuments.flatMap((doc) => doc.namespaces);
    return Array.from(new Set(namespaces));
  }

  private getDocumentsInNamespace(
    entityDocuments: any[],
    namespace: string
  ): any[] {
    return entityDocuments.filter((doc) => doc.namespaces.includes(namespace));
  }

  private getMatchingTables(documents: any[], tables: ITable[]): ITable[] {
    return tables.filter((table) =>
      documents.some(
        (doc) => doc.name.toLowerCase() === table.name.toLowerCase()
      )
    );
  }

  // Filter out relations that point to tables not in the current aggregate
  private filterTableRelations(tables: ITable[]): ITable[] {
    const tableNames = new Set(tables.map((table) => table.name.toLowerCase()));
    return tables.map((table) => ({
      ...table,
      relations: table.relations.filter((relation) =>
        tableNames.has(relation.target.toLowerCase())
      ),
    }));
  }
}
