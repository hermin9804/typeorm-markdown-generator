import { EntitySpec } from "../models/EntitySpec";
import { Namespace } from "../models/Namespace";
import { IClassDoc, ITable } from "../structures";

export class EntitySpecContainer {
  private uniqueNamespaceNames: string[] = [];
  private entitySpecs: EntitySpec[] = [];

  constructor(tables: ITable[], docs: IClassDoc[]) {
    tables.forEach((table) => {
      docs.forEach((doc) => {
        if (table.tableName === doc.className) {
          this.entitySpecs.push(new EntitySpec(table, doc));
        }
      });
    });
    this.updateMinitemsRelations();
    this.setUniqueNamespaceNames();
  }

  private updateMinitemsRelations() {
    const hasMinitemsTagRelations = this.entitySpecs.flatMap((entitySpec) =>
      entitySpec.getHasMinitemsTagRelations()
    );
    const inverseRelations = hasMinitemsTagRelations.map((relation) => ({
      source: relation.target,
      target: relation.source,
    }));
    inverseRelations.forEach((inverseRelation) => {
      this.entitySpecs.forEach((entitySpec) => {
        entitySpec.updatMinitemsRelation(inverseRelation);
      });
    });
  }

  public createNamespcace(): Namespace[] {
    return this.uniqueNamespaceNames.map((namespaceName) => {
      const tables = this.getTablesInNamespace(namespaceName);
      const docs = this.getDocsInNamespace(namespaceName);
      return new Namespace(namespaceName, tables, docs);
    });
  }

  private setUniqueNamespaceNames(): string[] {
    const namespaces = this.entitySpecs.flatMap((entitySpec) =>
      entitySpec.getNamespaces()
    );
    this.uniqueNamespaceNames = Array.from(new Set(namespaces));
    return this.uniqueNamespaceNames;
  }

  private getTablesInNamespace(namespaceName: string): ITable[] {
    const tables: ITable[] = [];
    this.entitySpecs.forEach((entitySpec) => {
      const table = entitySpec.getTable(namespaceName);
      if (table) {
        tables.push(table);
      }
    });
    return this.filterTableRelations(tables);
  }

  private filterTableRelations(tables: ITable[]): ITable[] {
    const tableNames = new Set(tables.map((table) => table.tableName));
    return tables.map((table) => ({
      ...table,
      relations: table.relations.filter((relation) =>
        tableNames.has(relation.target)
      ),
    }));
  }

  private getDocsInNamespace(namespaceName: string): IClassDoc[] {
    const docs: IClassDoc[] = [];
    this.entitySpecs.forEach((entitySpec) => {
      const doc = entitySpec.getDoc(namespaceName);
      if (doc) {
        docs.push(doc);
      }
    });
    return docs;
  }
}
