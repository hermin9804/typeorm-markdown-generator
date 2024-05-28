import { DataSource } from "typeorm";
import { MarkdownWriter } from "./writers/MarkdownWriter";
import { EntityDocAnalyzer } from "./analyzers/EntityDocAnalyzer";
import { EntityMetadataAnalyzer } from "./analyzers/EntityMetadataAnalyzer";
import { ITypeormMarkdownConfig } from "./structures";
import { findProjectRoot } from "./utils/findProjectRoot";
import { EntitySpecContainer } from "./services/EntitySpecContainer";

export class TypeormMarkdownGenerator {
  private markdownConfig: ITypeormMarkdownConfig;
  private entityMetadataAnalyzer: EntityMetadataAnalyzer;

  constructor(datasource: DataSource, markdownConfig: ITypeormMarkdownConfig) {
    this.markdownConfig = markdownConfig;
    this.entityMetadataAnalyzer = new EntityMetadataAnalyzer(datasource);
  }

  public async build(): Promise<void> {
    const entityPathFromRoot = `${await findProjectRoot()}/${
      this.markdownConfig.entityPath
    }`;

    const tables = await this.entityMetadataAnalyzer.analyze();
    const entityDocs = await EntityDocAnalyzer.analyze(entityPathFromRoot);

    const entitySpecContainer = new EntitySpecContainer(tables, entityDocs);
    const namespaces = entitySpecContainer.createNamespcace();

    const markdownWriter = new MarkdownWriter(this.markdownConfig, namespaces);
    markdownWriter.render();
  }
}
