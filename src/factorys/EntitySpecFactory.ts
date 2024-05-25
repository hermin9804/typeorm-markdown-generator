import { EntitySpec } from "../models/EntitySpec";
import { IClassDoc, ITable } from "../structures";

export class EntitySpecFactory {
  static create(tables: ITable[], docs: IClassDoc[]) {
    const entitySpecs: EntitySpec[] = [];
    tables.forEach((table) => {
      docs.forEach((doc) => {
        if (table.name === doc.name) {
          entitySpecs.push(new EntitySpec(table, doc));
        }
      });
    });
    return entitySpecs;
  }
}
