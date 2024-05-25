/**
 * analyzed typeorm entity metadata
 */
export interface ITable {
  name: string;
  columns: IColumn[];
  relations: IRelation[];
}

export interface IColumn {
  name: string;
  type: string;
  isPrimary: boolean;
  isForeignKey: boolean;
}

export interface IRelation {
  relationType: "one-to-one" | "one-to-many" | "many-to-one" | "many-to-many";
  propertyPath: string;
  nullable: boolean;
  isOwning: boolean;
  inverseSidePropertyPath: string;
  source: string;
  target: string;
  joinTableName: string;
}

/**
 * analyzed typeorm entity jsDoc
 * todo!!: tags 구별해야함.
 */
export interface IClassDoc {
  name: string;
  docs: string[];
  namespaces: string[];
  namespaceTags: string[];
  erdTags: string[];
  discribeTags: string[];
  hasHiddenTag: boolean;
  properties: IPropertyDoc[];
}

export interface IPropertyDoc {
  name: string;
  docs: string[];
  hasMinitemsTag: boolean;
}

/**
 * ITable, IClassDoc 을 동일한 namespace로 묶어주는 인터페이스
 */
export interface INamespace {
  name: string;
  tables: ITable[];
  classDocs: IClassDoc[];
}

/**
 * TypeormMarkdown Config interface
 */
export interface ITypeormMarkdownConfig {
  entityPath: string;
  title?: string; // default: ERD
  outFilePath?: string; // default: docs/ERD.md
}
