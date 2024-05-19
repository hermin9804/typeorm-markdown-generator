// typeorm entity metadata를 파싱한 결과를 담을 인터페이스.
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

// jsDoc를 파싱한 결과를 담을 인터페이스.
export interface IEntityDocument {
  name: string;
  docs: string[];
  namespaces: string[];
  properties: IPropertyDocument[];
}

export interface IPropertyDocument {
  name: string;
  docs: string[];
}

// Markdown의 각 색션을 담을 인터페이스.
export interface IAggregate {
  namespace: string;
  documents: IEntityDocument[];
  tables: ITable[];
}
