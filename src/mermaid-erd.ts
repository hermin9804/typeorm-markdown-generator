// import { DataSource, EntityMetadata } from "typeorm";
// import { metadataUtils, ExtractedRelations } from "./entity-metadata-utils";

import { ITable } from "./table-factory";

// const RelationShips = {
//   left: {
//     "one-to-many": "||",
//     "many-to-one": "}|",
//     "one-to-one": "||",
//     "many-to-many": "}|",
//   },
//   right: {
//     "one-to-many": "|{",
//     "many-to-one": "||",
//     "one-to-one": "||",
//     "many-to-many": "|{",
//   },
// };

// /**
//  * Render a mermaid ERD based on the spec here:
//  * https://mermaid-js.github.io/mermaid/#/entityRelationshipDiagram
//  */
// export class MermaidErd {
//   private meta: EntityMetadata[] = [];
//   private relations: ExtractedRelations = {};
//   private dataSource: DataSource;

//   constructor(dataSource: DataSource) {
//     this.dataSource = dataSource;
//   }

//   public async initialize() {
//     this.meta = await metadataUtils.fetchEntityMetadata(this.dataSource);
//     this.relations = metadataUtils.extractRelations(this.meta);
//     console.log("this.relations: ", JSON.stringify(this.relations, null, 2));
//   }

//   public render(): string {
//     return `erDiagram\n  ${this.renderTables()}\n  ${this.renderRelations()}`;
//   }

//   private renderRelations() {
//     return this.buildRelations().join("\n  ");
//   }

//   private buildRelations() {
//     return Object.entries(this.relations).reduce((acc, [key, values]) => {
//       const relations = values.entityRelations.map((rel) => {
//         // Remove unnamed relations and only add relations for the explicit owner
//         if (!rel.propertyPath || !rel.isOwning) return "";

//         return `${rel.source} ${RelationShips["left"][rel.relationType]}--${
//           RelationShips["right"][rel.relationType]
//         } ${rel.target}: ${rel.propertyPath}`;
//       });

//       return [...acc, ...relations.filter(Boolean)];
//     }, [] as string[]);
//   }

//   private renderTables() {
//     return this.meta
//       .map((entry) => {
//         const columns = entry.columns.map((column) => {
//           const type = this.dataSource.driver.normalizeType(column);
//           const name = column.databaseName;
//           const isPrimary = column.isPrimary ? "PK" : "";
//           const isForeignKey = column.referencedColumn ? "FK" : "";
//           const comment = column.comment && `"${column.comment}"`;
//           // console.log("column: ", column);
//           // console.log("type: ", type);
//           // console.log("name: ", name);
//           // console.log("isPrimary: ", isPrimary);
//           // console.log("isForeignKey: ", isForeignKey);
//           // console.log("comment: ", comment);

//           return [
//             this.dataSource.driver.normalizeType(column),
//             column.databaseName,
//             column.isPrimary ? "PK" : column.referencedColumn ? "FK" : "",
//             column.comment && `"${column.comment}"`,
//           ]
//             .filter(Boolean)
//             .join(" ");
//         });

//         return `${entry.tableName} {\n    ${columns.join("\n    ")}\n  }`;
//       })
//       .join("\n  ");
//   }
// }

const RelationShips = {
  left: {
    "one-to-many": "||",
    "many-to-one": "}|",
    "one-to-one": "||",
    "many-to-many": "}|",
  },
  right: {
    "one-to-many": "|{",
    "many-to-one": "||",
    "one-to-one": "||",
    "many-to-many": "|{",
  },
};

/**
 * Render a mermaid ERD based on the spec here:
 * https://mermaid-js.github.io/mermaid/#/entityRelationshipDiagram
 */
export class MermaidErd {
  private tables: ITable[];

  constructor(tables: ITable[]) {
    this.tables = tables;
  }

  public render(): string {
    return `erDiagram\n  ${this.renderTables()}\n  ${this.renderRelations()}`;
  }

  private renderRelations() {
    return this.buildRelations().join("\n  ");
  }

  private buildRelations() {
    return this.tables.reduce((acc, table) => {
      const relations = table.relations.map((rel) => {
        // Only add relations for the explicit owner
        if (!rel.propertyPath || !rel.isOwning) return "";

        return `${rel.source} ${RelationShips["left"][rel.relationType]}--${
          RelationShips["right"][rel.relationType]
        } ${rel.target}: ${rel.propertyPath}`;
      });

      return [...acc, ...relations.filter(Boolean)];
    }, [] as string[]);
  }

  private renderTables() {
    return this.tables
      .map((table) => {
        const columns = table.columns.map((column) => {
          const type = column.type;
          const name = column.name;
          const isPrimary = column.isPrimary ? "PK" : "";
          const isForeignKey = column.isForeignKey ? "FK" : "";

          return [type, name, isPrimary, isForeignKey]
            .filter(Boolean)
            .join(" ");
        });

        return `${table.name} {\n    ${columns.join("\n    ")}\n  }`;
      })
      .join("\n  ");
  }
}
