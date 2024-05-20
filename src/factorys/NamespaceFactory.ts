// import { IClassDoc, INamespace, ITable } from "../structures";

// export class NmaespaceFactory {
//   public async create(
//     tables: ITable[],
//     classDocs: IClassDoc[]
//   ): Promise<INamespace[]> {
//     const uniqueNamespaces = this.getUniqueNamespaces(classDocs);

//     return uniqueNamespaces.map((namespace) => {
//       const documentsInNamespace = this.getDocumentsInNamespace(
//         classDocs,
//         namespace
//       );
//       const matchingTables = this.getMatchingTables(
//         documentsInNamespace,
//         tables
//       );
//       const filteredTables = this.filterTableRelations(matchingTables);
//       return {
//         namespace,
//         documents: documentsInNamespace,
//         tables: filteredTables,
//       };
//     });
//   }

//   private getUniqueNamespaces(classDocs: IClassDoc[]): string[] {
//     const namespaces = classDocs.flatMap((doc) => doc.namespaces);
//     return Array.from(new Set(namespaces));
//   }

//   private getDocumentsInNamespace(
//     classDocs: IClassDoc[],
//     namespace: string
//   ): IClassDoc[] {
//     return classDocs.filter((doc) => doc.namespaces.includes(namespace));
//   }

//   private getMatchingTables(documents: any[], tables: ITable[]): ITable[] {
//     return tables.filter((table) =>
//       documents.some(
//         (doc) => doc.name.toLowerCase() === table.name.toLowerCase()
//       )
//     );
//   }

//   // Filter out relations that point to tables not in the current aggregate
//   private filterTableRelations(tables: ITable[]): ITable[] {
//     const tableNames = new Set(tables.map((table) => table.name.toLowerCase()));
//     return tables.map((table) => ({
//       ...table,
//       relations: table.relations.filter((relation) =>
//         tableNames.has(relation.target.toLowerCase())
//       ),
//     }));
//   }
// }

import { IClassDoc, INamespace, ITable } from "../structures";

export class NamespaceFactory {
  public create(tables: ITable[], classDocs: IClassDoc[]): INamespace[] {
    const uniqueNamespaces = this.getUniqueNamespaces(classDocs);

    return uniqueNamespaces.map((namespace) => {
      const classDocsInNamespace = this.getClassDocsInNamespace(
        classDocs,
        namespace
      );
      const matchingTables = this.getMatchingTables(
        classDocsInNamespace,
        tables
      );
      const filteredTables = this.filterTableRelations(matchingTables);
      return {
        namespace,
        classDocs: classDocsInNamespace,
        tables: filteredTables,
      };
    });
  }

  private getUniqueNamespaces(classDocs: IClassDoc[]): string[] {
    const namespaces = classDocs.flatMap((doc) => doc.namespaces);
    return Array.from(new Set(namespaces));
  }

  private getClassDocsInNamespace(
    classDocs: IClassDoc[],
    namespace: string
  ): IClassDoc[] {
    return classDocs.filter((doc) => doc.namespaces.includes(namespace));
  }

  private getMatchingTables(
    classDocs: IClassDoc[],
    tables: ITable[]
  ): ITable[] {
    return tables.filter((table) =>
      classDocs.some((doc) => doc.name === table.name)
    );
  }

  // Filter out relations that point to tables not in the current namespace
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
