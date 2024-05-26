import { IClassDoc, ITable } from "../structures";

export class EntitySpec {
  private entityName: string;
  private table: ITable;
  private doc: IClassDoc;

  constructor(table: ITable, doc: IClassDoc) {
    this.entityName = table.tableName;
    this.table = table;
    this.doc = doc;
    this.linkMinitemsTagBetweenTableAndDoc();
  }

  public getNamespaces(): string[] {
    return this.doc.namespaces;
  }

  private linkMinitemsTagBetweenTableAndDoc() {
    const minitemTagedProperties = this.doc.properties.filter(
      (property) => property.hasMinitemsTag
    );
    minitemTagedProperties.forEach((property) => {
      this.table.relations.forEach((relation) => {
        if (relation.propertyPath === property.propertyName) {
          relation.hasMinitemsTag = true;
        }
      });
    });
  }

  public getHasMinitemsTagRelations() {
    return this.table.relations.filter((relation) => relation.hasMinitemsTag);
  }

  public updatMinitemsRelation({
    source,
    target,
  }: {
    source: string;
    target: string;
  }) {
    const relation = this.getRelationByRelationSourceAndTarget(source, target);
    if (!relation) return;
    if (relation.relationType === "one-to-one") {
      relation.relationType = "minitems-one-to-one";
    } else if (relation.relationType === "many-to-one") {
      relation.relationType = "minitems-many-to-one";
    } else if (relation.relationType === "many-to-many") {
      relation.relationType = "minitems-many-to-many";
    }
  }

  private getRelationByRelationSourceAndTarget(source: string, target: string) {
    return this.table.relations.find(
      (relation) => relation.source === source && relation.target === target
    );
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
}
