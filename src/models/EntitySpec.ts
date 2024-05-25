import { IClassDoc, ITable } from "../structures";

export class EntitySpec {
  private name: string;
  private table: ITable;
  private doc: IClassDoc;

  constructor(table: ITable, doc: IClassDoc) {
    this.name = table.name;
    this.table = table;
    this.doc = doc;
  }
}
