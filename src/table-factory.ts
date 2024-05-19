import { DataSource, EntityMetadata, EntitySchema } from "typeorm";
import { ConnectionMetadataBuilder } from "typeorm/connection/ConnectionMetadataBuilder";
import { RelationMetadata } from "typeorm/metadata/RelationMetadata";

export interface ITable {
  name: string;
  columns: IColumn[];
  relations: IRelation[];
}

interface IColumn {
  type: string;
  name: string;
  isPrimary: boolean;
  isForeignKey: boolean;
}

interface IRelation {
  relationType: RelationType;
  propertyPath: string;
  nullable: boolean;
  isOwning: boolean;
  inverseSidePropertyPath: string;
  source: string;
  target: string;
  joinTableName: string;
}

type RelationType =
  | "one-to-one"
  | "one-to-many"
  | "many-to-one"
  | "many-to-many";

export class TableFactory {
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  public async getTables(): Promise<ITable[]> {
    const connectionMetadataBuilder = new ConnectionMetadataBuilder(
      this.dataSource
    );

    const { entities } = this.dataSource.options;
    const TEntities = entities as (Function | EntitySchema<any> | string)[];

    let entityMetadata: EntityMetadata[];

    if (entities) {
      entityMetadata = await connectionMetadataBuilder.buildEntityMetadatas(
        TEntities
      );
    } else {
      throw Error("No entities found on connection");
    }

    const tables: ITable[] = entityMetadata.map((entity) => {
      const columns: IColumn[] = entity.columns.map((column) => ({
        type: this.dataSource.driver.normalizeType(column),
        name: column.databaseName,
        isPrimary: column.isPrimary,
        isForeignKey: !!column.referencedColumn,
      }));

      const relations: IRelation[] = entity.relations.map((rel) =>
        this.resolveRelation(entity, rel)
      );

      return {
        name: entity.tableName,
        columns,
        relations,
      };
    });

    return tables;
  }

  private resolveRelation(
    entity: EntityMetadata,
    {
      relationType,
      inverseEntityMetadata,
      propertyPath,
      inverseSidePropertyPath,
      isOwning,
      joinTableName,
      inverseRelation,
    }: RelationMetadata
  ): IRelation {
    const column = entity.columns.find((c) => c.propertyName === propertyPath);
    const nullable = column ? column.isNullable : false;

    let target = inverseEntityMetadata.tableName;
    let derivedRelationType = relationType;
    let derivedJoinTable =
      inverseRelation && inverseRelation.joinTableName
        ? inverseRelation.joinTableName
        : joinTableName;
    let derivedOwnership = isOwning;

    if (derivedJoinTable) {
      target = derivedJoinTable;
      derivedRelationType = "one-to-many";
      derivedOwnership = true;
    }

    return {
      relationType: derivedRelationType,
      propertyPath,
      isOwning: derivedOwnership,
      nullable,
      inverseSidePropertyPath,
      source: entity.tableName,
      joinTableName: derivedJoinTable,
      target,
    };
  }
}
