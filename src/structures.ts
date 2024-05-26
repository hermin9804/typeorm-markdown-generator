/**
 * analyzed typeorm entity metadata
 */
export interface ITable {
  tableName: string;
  columns: IColumn[];
  relations: IRelation[];
}

export interface IColumn {
  columnName: string;
  type: string;
  isPrimary: boolean;
  isForeignKey: boolean;
  isNullable: boolean;
}

export interface IRelation {
  relationType:
    | "one-to-one"
    | "one-to-many"
    | "many-to-one"
    | "many-to-many"
    | "minitems-one-to-one"
    | "minitems-many-to-one"
    | "minitems-many-to-many";
  propertyPath: string;
  nullable: boolean;
  isOwning: boolean;
  inverseSidePropertyPath: string;
  source: string;
  target: string;
  joinTableName: string;
  hasMinitemsTag: boolean;
}

/**
 * analyzed typeorm entity jsDoc
 */
export interface IClassDoc {
  className: string;
  docs: string[];
  namespaceTags: string[];
  erdTags: string[];
  describeTags: string[];
  hasHiddenTag: boolean;
  properties: IPropertyDoc[];
}

export interface IPropertyDoc {
  propertyName: string;
  docs: string[];
  hasMinitemsTag: boolean;
}

/**
 * ITable, IClassDoc 을 일한 namespace로 묶어주는 인터페이스
 */
export interface INamespace {
  namespaceName: string;
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
