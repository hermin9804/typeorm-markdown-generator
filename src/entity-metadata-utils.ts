import { DataSource, EntityMetadata, EntitySchema } from "typeorm";
import { ConnectionMetadataBuilder } from "typeorm/connection/ConnectionMetadataBuilder";
import { RelationMetadata } from "typeorm/metadata/RelationMetadata";
import { RelationType } from "typeorm/metadata/types/RelationTypes";

export type ExtractedRelations = Record<
  string,
  {
    entityRelations: RelationData[];
  }
>;

interface RelationData {
  relationType: RelationType;
  propertyPath: string;
  nullable: boolean;
  isOwning: boolean;
  inverseSidePropertyPath: string;
  source: string;
  target: string;
  joinTableName: string;
}

export const fetchEntityMetadata = async (
  connection: DataSource
): Promise<EntityMetadata[]> => {
  const connectionMetadataBuilder = new ConnectionMetadataBuilder(connection);

  const { entities } = connection.options;
  const TEntities = entities as (Function | EntitySchema<any> | string)[];

  let entityMetadata;

  if (entities) {
    entityMetadata = await connectionMetadataBuilder.buildEntityMetadatas(
      TEntities
    );
  } else {
    throw Error("No entities found on connection");
  }

  return entityMetadata;
};

/**
 * Return the relation data for each table
 *
 */
export const extractRelations = (
  meta: EntityMetadata[]
): ExtractedRelations => {
  const relationData = meta.reduce<ExtractedRelations>((acc, entity) => {
    const entityRelations = entity.relations.map((rel) =>
      resolveRelation(entity, rel)
    );

    return {
      ...acc,
      [entity.tableName]: {
        entityRelations,
      },
    };
  }, {});

  return relationData;
};

export const metadataUtils = {
  fetchEntityMetadata,
  extractRelations,
};

// Private
/*
 * Resolve entity relationships to a normalised entity to entity relation even
 * when there are join tables
 */
const resolveRelation = (
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
): RelationData => {
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
};
