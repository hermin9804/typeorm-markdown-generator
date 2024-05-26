import { DataSource, EntityMetadata, EntitySchema } from "typeorm";
import { ConnectionMetadataBuilder } from "typeorm/connection/ConnectionMetadataBuilder";
import { RelationMetadata } from "typeorm/metadata/RelationMetadata";
import { IColumn, IRelation, ITable } from "../structures";

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
        type: dataSource.driver.normalizeType(column),
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

    const ret = {
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
    // console.log(ret);
    return ret;
  }
}
