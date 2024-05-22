/**
 * analyzed typeorm entity metadata
 */
export interface ITable {
  name: string;
  columns: IColumn[];
  relations: IRelation[];
}

export interface IColumn {
  type: string;
  name: string;
  isPrimary: boolean;
  isForeignKey: boolean;
}

export interface IRelation {
  relationType: RelationType;
  propertyPath: string;
  nullable: boolean;
  isOwning: boolean;
  inverseSidePropertyPath: string;
  source: string;
  target: string;
  joinTableName: string;
}

export type RelationType =
  | "one-to-one"
  | "one-to-many"
  | "many-to-one"
  | "many-to-many";

/**
 * analyzed typeorm entity jsDoc
 * todo!!: tags 구별해야함.
 */
export interface IClassDoc {
  name: string;
  docs: string[];
  namespaces: string[];
  properties: IPropertyDoc[];
}

export interface IPropertyDoc {
  name: string;
  docs: string[];
}

/**
 * ITable, IClassDoc 을 동일한 namespace로 묶어주는 인터페이스
 */
export interface INamespace {
  name: string;
  classDocs: IClassDoc[];
  tables: ITable[];
}

/**
 * TypeormMarkdown Config interface
 */
export interface ITypeormMarkdownConfig {
  entityPath: string;
  title?: string; // default: ERD
  outFilePath?: string; // default: docs/ERD.md
}
