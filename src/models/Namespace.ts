import { IClassDoc, ITable } from "../structures";

export class Namespace {
  public namespaceName: string;
  public tables: ITable[];
  public classDocs: IClassDoc[];

  constructor(namespaceName: string, tables: ITable[], classDocs: IClassDoc[]) {
    this.namespaceName = namespaceName;
    this.tables = tables;
    this.classDocs = classDocs;
  }
}
