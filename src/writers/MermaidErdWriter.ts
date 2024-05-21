import { ITable } from "../structures";

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
export class MermaidErdWriter {
  public render(tables: ITable[]): string {
    return `erDiagram\n  ${this.renderTables(tables)}\n  ${this.renderRelations(
      tables
    )}`;
  }

  private renderRelations(tables: ITable[]) {
    return this.buildRelations(tables).join("\n  ");
  }

  private buildRelations(tables: ITable[]) {
    return tables.reduce((acc, table) => {
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

  private renderTables(tables: ITable[]) {
    return tables
      .map((table) => {
        const columns = table.columns.map((column) => {
          const type = column.type.replace(/ /g, "_");
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
