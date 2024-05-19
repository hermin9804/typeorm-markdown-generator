import { ITable } from "./types";

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
