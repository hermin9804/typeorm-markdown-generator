// import { EntitySpec } from "../models/EntitySpec";
// import { Namespace } from "../models/Namespace";

// export class NamespaceFactory {
//   private static uniqueNamespaceNames: string[] = [];

//   static create(entitySpecs: EntitySpec[]): Namespace[] {
//     this.setUniqueNamespaces(entitySpecs);

//     return this.uniqueNamespaceNames.map((namespaceName) => {
//       const entitySpecsInNamespace = this.getEntitySpecsInNamespace(
//         entitySpecs,
//         namespaceName
//       ).map((entitySpec) => entitySpec.clone());
//       return new Namespace(namespaceName, entitySpecsInNamespace);
//     });
//   }

//   private static setUniqueNamespaces(entitySpecs: EntitySpec[]) {
//     const namespaces = entitySpecs.flatMap((entitySpec) =>
//       entitySpec.getNamespaces()
//     );
//     this.uniqueNamespaceNames = Array.from(new Set(namespaces));
//   }

//   private static getEntitySpecsInNamespace(
//     entitySpecs: EntitySpec[],
//     namespaceName: string
//   ): EntitySpec[] {
//     return entitySpecs.filter((entitySpec) => {
//       return entitySpec.hasNamespace(namespaceName);
//     });
//   }
// }

// import { IClassDoc, INamespace, ITable } from "../structures";

// export class NamespaceFactory {
//   public static create(tables: ITable[], classDocs: IClassDoc[]): INamespace[] {
//     const uniqueNamespaces = this.getUniqueNamespaces(classDocs);

//     return uniqueNamespaces.map((namespace) => {
//       const classDocsInNamespace = this.getClassDocsInNamespace(
//         classDocs,
//         namespace
//       );
//       const matchingTables = this.getMatchingTables(
//         classDocsInNamespace,
//         tables
//       );
//       const filteredTables = this.filterTableRelations(matchingTables);
//       return {
//         name: namespace,
//         classDocs: classDocsInNamespace,
//         tables: filteredTables,
//       };
//     });
//   }

//   private static getUniqueNamespaces(classDocs: IClassDoc[]): string[] {
//     const namespaces = classDocs.flatMap((doc) => doc.namespaces);
//     return Array.from(new Set(namespaces));
//   }

//   private static getClassDocsInNamespace(
//     classDocs: IClassDoc[],
//     namespace: string
//   ): IClassDoc[] {
//     return classDocs.filter((doc) => doc.namespaces.includes(namespace));
//   }

//   private static getMatchingTables(
//     classDocs: IClassDoc[],
//     tables: ITable[]
//   ): ITable[] {
//     return tables.filter((table) =>
//       classDocs.some((doc) => doc.name === table.name)
//     );
//   }

//   // Filter out relations that point to tables not in the current namespace
//   private static filterTableRelations(tables: ITable[]): ITable[] {
//     const tableNames = new Set(tables.map((table) => table.name));
//     return tables.map((table) => ({
//       ...table,
//       relations: table.relations.filter((relation) =>
//         tableNames.has(relation.target)
//       ),
//     }));
//   }
// }
