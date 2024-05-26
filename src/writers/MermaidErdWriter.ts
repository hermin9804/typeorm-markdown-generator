import { ITable } from "../structures";

const RelationShips = {
  left: {
    "one-to-one": "|o",
    "one-to-many": "||",
    "many-to-one": "}o",
    "many-to-many": "}|",
    "minitems-one-to-one": "||",
    "minitems-many-to-one": "}|",
    "minitems-many-to-many": "}|",
  },
  right: {
    "one-to-one": "||",
    "one-to-many": "|{",
    "many-to-one": "||",
    "many-to-many": "|{",
    "minitems-one-to-one": "||",
    "minitems-many-to-one": "||",
    "minitems-many-to-many": "|{",
  },
};

/**
 * Render a mermaid ERD based on the spec here:
 * https://mermaid-js.github.io/mermaid/#/entityRelationshipDiagram
 */
export class MermaidErdWriter {
  public static render(tables: ITable[]): string {
    return `erDiagram\n  ${this.renderTables(tables)}\n  ${this.renderRelations(
      tables
    )}`;
  }

  private static renderRelations(tables: ITable[]) {
    return this.buildRelations(tables).join("\n  ");
  }

  private static buildRelations(tables: ITable[]) {
    return tables.reduce((acc, table) => {
      const relations = table.relations.map((rel) => {
        // Only add relations for the explicit owner
        if (!rel.propertyPath || !rel.isOwning) return "";

        return `${rel.source} ${RelationShips.left[rel.relationType]}--${
          RelationShips.right[rel.relationType]
        } ${rel.target}: ${rel.propertyPath}`;
      });

      return [...acc, ...relations.filter(Boolean)];
    }, [] as string[]);
  }

  private static renderTables(tables: ITable[]) {
    return tables
      .map((table) => {
        const columns = table.columns.map((column) => {
          const columnType = column.type.replace(/ /g, "_");
          const columnName = column.columnName;
          const isPrimary = column.isPrimary ? "PK" : "";
          const isForeignKey = column.isForeignKey ? "FK" : "";
          const isNullable = column.isNullable ? '"nullable"' : "";

          return [columnType, columnName, isPrimary, isForeignKey, isNullable]
            .filter(Boolean)
            .join(" ");
        });

        return `${table.tableName} {\n    ${columns.join("\n    ")}\n  }`;
      })
      .join("\n  ");
  }
}
