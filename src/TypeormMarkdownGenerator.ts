import { DataSource } from "typeorm";
import { MarkdownWriter } from "./writers/MarkdownWriter";
import { EntityDocAnalyzer } from "./analyzers/EntityDocAnalyzer";
import { EntityMetadataAnalyzer } from "./analyzers/EntityMetadataAnalyzer";
import { NamespaceFactory } from "./factorys/NamespaceFactory";
import { ITypeormMarkdownConfig } from "./structures";
import { EntitySpecFactory } from "./factorys/EntitySpecFactory";
import { findProjectRoot } from "./utils/findProjectRoot";

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

    const namespaces = NamespaceFactory.create(tables, entityDocs);

    const entitySpecs = EntitySpecFactory.create(tables, entityDocs);

    MarkdownWriter.render(
      this.markdownConfig.title,
      this.markdownConfig.outFilePath,
      namespaces
    );
  }
}
