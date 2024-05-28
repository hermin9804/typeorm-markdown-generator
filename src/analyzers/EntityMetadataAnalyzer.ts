import { DataSource, EntityMetadata, EntitySchema } from "typeorm";
import { ConnectionMetadataBuilder } from "typeorm/connection/ConnectionMetadataBuilder";
import { RelationMetadata } from "typeorm/metadata/RelationMetadata";
import { IColumn, IIndex, IRelation, ITable } from "../structures";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";

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

export class EntityMetadataAnalyzer {
  private dataSource: DataSource;
  private wasDataSourceAlreadyInitialized: boolean;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
    this.wasDataSourceAlreadyInitialized = dataSource.isInitialized;
  }

  public async analyze(): Promise<ITable[]> {
    await this.initialize();
    const entityMetadatas = await this.getEntityMetadatas();
    const tables = entityMetadatas.map((entity) => this.mapTable(entity));
    await this.cleanup();
    return tables;
  }

  private async initialize() {
    if (!this.wasDataSourceAlreadyInitialized) {
      await this.dataSource.initialize();
    }
  }

  private async cleanup() {
    if (!this.wasDataSourceAlreadyInitialized) {
      await this.dataSource.destroy();
    }
  }

  private async getEntityMetadatas(): Promise<EntityMetadata[]> {
    const connectionMetadataBuilder = new ConnectionMetadataBuilder(
      this.dataSource
    );
    const { entities } = this.dataSource.options;
    if (!entities || entities.length === 0) {
      throw new Error(
        "No entities found on connection, check your TypeORM datasource entities or entity path"
      );
    }

    const TEntities = entities as (Function | EntitySchema<any> | string)[];
    const entityMetadatas =
      await connectionMetadataBuilder.buildEntityMetadatas(TEntities);

    if (entityMetadatas.length === 0) {
      throw new Error(
        "No entities found on connection, check your TypeORM datasource entities or entity path"
      );
    }

    return entityMetadatas;
  }

  private mapTable(entity: EntityMetadata): ITable {
    return {
      tableName: entity.tableName,
      columns: this.mapColumns(entity),
      relations: this.mapRelations(entity),
      indices: this.mapIndexes(entity),
    };
  }

  private mapColumns(entity: EntityMetadata): IColumn[] {
    return entity.columns.map((column) => ({
      type: this.normalizeType(column),
      columnName: column.databaseName,
      isPrimary: column.isPrimary,
      isForeignKey: !!column.referencedColumn,
      isNullable: column.isNullable,
    }));
  }

  private normalizeType(column: ColumnMetadata): string {
    const originalType = this.dataSource.driver.normalizeType(column);
    return SHORTEST_COLUMN_TYPE[originalType] || originalType;
  }

  private mapRelations(entity: EntityMetadata): IRelation[] {
    return entity.relations.map((relation) =>
      this.resolveRelation(entity, relation)
    );
  }

  private resolveRelation(
    entity: EntityMetadata,
    relation: RelationMetadata
  ): IRelation {
    const column = entity.columns.find(
      (c) => c.propertyName === relation.propertyPath
    );
    const nullable = column ? column.isNullable : false;

    let target = relation.inverseEntityMetadata.tableName;
    let derivedRelationType = relation.relationType;
    let derivedJoinTable = relation.joinTableName;
    let derivedOwnership = relation.isOwning;

    if (
      relation.joinColumns.length > 0 &&
      relation.inverseJoinColumns.length > 0
    ) {
      derivedRelationType = "many-to-many";
    }

    return {
      relationType: derivedRelationType,
      propertyPath: relation.propertyPath,
      isOwning: derivedOwnership,
      nullable,
      inverseSidePropertyPath: relation.inverseSidePropertyPath,
      source: entity.tableName,
      joinTableName: derivedJoinTable,
      target,
      hasMinitemsTag: false,
    };
  }

  private mapIndexes(entity: EntityMetadata): IIndex[] {
    const ret = entity.indices.map((index) => ({
      tableName: entity.tableName,
      indexName: index.name,
      columns: index.columns.map((col) => col.databaseName).join(", "),
      isUnique: index.isUnique,
      isSpatial: index.isSpatial,
      where: index.where || "",
    }));
    return ret;
  }
}
