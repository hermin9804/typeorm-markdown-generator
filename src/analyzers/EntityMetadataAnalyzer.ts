import { DataSource, EntityMetadata, EntitySchema } from "typeorm";
import { ConnectionMetadataBuilder } from "typeorm/connection/ConnectionMetadataBuilder";
import { RelationMetadata } from "typeorm/metadata/RelationMetadata";
import { IColumn, IRelation, ITable } from "../structures";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";

export class EntityMetadataAnalyzer {
  public static async analyze(dataSource: DataSource): Promise<ITable[]> {
    await this.initialize(dataSource);
    const connectionMetadataBuilder = new ConnectionMetadataBuilder(dataSource);
    const { entities } = dataSource.options;
    const TEntities = entities as (Function | EntitySchema<any> | string)[];
    let entityMetadatas: EntityMetadata[];
    if (entities) {
      entityMetadatas = await connectionMetadataBuilder.buildEntityMetadatas(
        TEntities
      );
      if (entityMetadatas.length === 0) {
        throw Error(
          "No entities found on connection, check your Typeorm datasource entities or entity path"
        );
      }
    } else {
      throw Error("No entities found on connection");
    }
    const tables = this.mapTables(dataSource, entityMetadatas);
    await this.destroy(dataSource);
    return tables;
  }

  private static async initialize(dataSource: DataSource) {
    await dataSource.initialize();
  }

  private static async destroy(dataSource: DataSource) {
    await dataSource.destroy();
  }

  private static mapTables(
    dataSource: DataSource,
    entityMetadatas: EntityMetadata[]
  ): ITable[] {
    return entityMetadatas.map((entity) => {
      const columns: IColumn[] = entity.columns.map((column) => ({
        type: this.normalizeType(column, dataSource),
        columnName: column.databaseName,
        isPrimary: column.isPrimary,
        isForeignKey: !!column.referencedColumn,
        isNullable: column.isNullable,
      }));
      const relations: IRelation[] = entity.relations.map((rel) =>
        this.resolveRelation(entity, rel)
      );
      return {
        tableName: entity.tableName,
        columns,
        relations,
      };
    });
  }

  private static normalizeType(
    column: ColumnMetadata,
    dataSource: DataSource
  ): string {
    const originalType = dataSource.driver.normalizeType(column);
    return SHORTEST_COLUMN_TYPE[originalType] || originalType;
  }

  private static resolveRelation(
    entity: EntityMetadata,
    {
      relationType,
      inverseEntityMetadata,
      propertyPath,
      inverseSidePropertyPath,
      isOwning,
      joinTableName,
      joinColumns,
      inverseJoinColumns,
      inverseRelation,
    }: RelationMetadata
  ): IRelation {
    const column = entity.columns.find((c) => c.propertyName === propertyPath);
    const nullable = column ? column.isNullable : false;

    let target = inverseEntityMetadata.tableName;
    let derivedRelationType = relationType;
    let derivedJoinTable = joinTableName;
    let derivedOwnership = isOwning;

    if (joinColumns.length > 0 && inverseJoinColumns.length > 0) {
      derivedRelationType = "many-to-many";
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
      hasMinitemsTag: false,
    };
  }
}

const SHORTEST_COLUMN_TYPE: { [key: string]: string } = {
  "character varying": "varchar",
  "varying character": "varchar",
  "timestamp without time zone": "timestamp",
  "timestamp with time zone": "timestamptz",
  "double precision": "double",
  "timestamp with local time zone": "timestamp",
  "time without time zone": "time",
  "time with time zone": "timetz",
};
