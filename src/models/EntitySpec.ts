import { IClassDoc, ITable } from "../structures";

export class EntitySpec {
  private entityName: string;
  private table: ITable;
  private doc: IClassDoc;

  constructor(table: ITable, doc: IClassDoc) {
    this.entityName = table.tableName;
    this.table = table;
    this.doc = doc;
  }

  public getNamespaces(): string[] {
    return this.doc.namespaces;
  }

  public getTable(namespaceName: string): ITable | null {
    if (this.doc.hasHiddenTag) return null;
    if (this.doc.namespaceTags.includes(namespaceName)) return this.table;
    if (this.doc.erdTags.includes(namespaceName)) return this.table;
    return null;
  }

  public getDoc(namespaceName: string): IClassDoc | null {
    if (this.doc.hasHiddenTag) return null;
    if (this.doc.namespaceTags.includes(namespaceName)) return this.doc;
    if (this.doc.discribeTags.includes(namespaceName)) return this.doc;
    return null;
  }

  clone(): EntitySpec {
    return new EntitySpec(this.table, this.doc);
  }
}
