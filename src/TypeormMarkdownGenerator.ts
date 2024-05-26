import { DataSource } from "typeorm";
import { MarkdownWriter } from "./writers/MarkdownWriter";
import { EntityDocAnalyzer } from "./analyzers/EntityDocAnalyzer";
import { EntityMetadataAnalyzer } from "./analyzers/EntityMetadataAnalyzer";
import { ITypeormMarkdownConfig } from "./structures";
import { findProjectRoot } from "./utils/findProjectRoot";
import { EntitySpecContainer } from "./services/EntitySpecContainer";

export class TypeormMarkdownGenerator {
  private datasource: DataSource;
  private markdownConfig: ITypeormMarkdownConfig;

  constructor(datasource: DataSource, markdownConfig: ITypeormMarkdownConfig) {
    this.datasource = datasource;
    this.markdownConfig = markdownConfig;
  }

  public async build(): Promise<void> {
    const entityPathFromRoot = `${await findProjectRoot()}/${
      this.markdownConfig.entityPath
    }`;
    const tables = await EntityMetadataAnalyzer.analyze(this.datasource);
    const entityDocs = await EntityDocAnalyzer.analyze(entityPathFromRoot);

    const entitySpecContainer = new EntitySpecContainer(tables, entityDocs);
    const namespaces = entitySpecContainer.createNamespcace();

    MarkdownWriter.render(
      this.markdownConfig.title,
      this.markdownConfig.outFilePath,
      namespaces
    );
  }
}
