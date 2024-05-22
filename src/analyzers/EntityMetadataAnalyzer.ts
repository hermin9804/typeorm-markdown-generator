import { DataSource, EntityMetadata, EntitySchema } from "typeorm";
import { ConnectionMetadataBuilder } from "typeorm/connection/ConnectionMetadataBuilder";
import { RelationMetadata } from "typeorm/metadata/RelationMetadata";
import {
  IColumn,
  IRelation,
  ITable,
  ITypeormMarkdownConfig,
} from "../structures";

export class EntityMetadataAnalyzer {
  private dataSource: DataSource;

  constructor(config: ITypeormMarkdownConfig) {
    this.dataSource = new DataSource({
      ...config,
      entities: [config.entityPath],
    });
  }

  private async initialize() {
    // Initialize the connection
    await this.dataSource.initialize();
  }

  private async destroy() {
    // Destroy the connection
    await this.dataSource.destroy();
  }

  public async analyze(): Promise<ITable[]> {
    await this.initialize();
    const connectionMetadataBuilder = new ConnectionMetadataBuilder(
      this.dataSource
    );

    const { entities } = this.dataSource.options;
    const TEntities = entities as (Function | EntitySchema<any> | string)[];

    let entityMetadatas: EntityMetadata[];

    if (entities) {
      entityMetadatas = await connectionMetadataBuilder.buildEntityMetadatas(
        TEntities
      );
    } else {
      throw Error("No entities found on connection");
    }

    const tables = this.mapTables(entityMetadatas);

    await this.destroy();
    return tables;
  }

  private mapTables(entityMetadatas: EntityMetadata[]): ITable[] {
    return entityMetadatas.map((entity) => {
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
