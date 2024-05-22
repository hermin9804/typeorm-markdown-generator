import { MarkdownWriter } from "./writers/MarkdownWriter";
import { EntityDocAnalyzer } from "./analyzers/EntityDocAnalyzer";
import { EntityMetadataAnalyzer } from "./analyzers/EntityMetadataAnalyzer";
import { NamespaceFactory } from "./factorys/NamespaceFactory";
import { ITypeormMarkdownConfig } from "./structures";
import findProjectRoot from "./utils/findProjectRoot";
import { DataSource } from "typeorm";

export class TypeormMarkdownGenerator {
  private readonly markdownConfig: ITypeormMarkdownConfig;
  private readonly entityMetadataAnalyzer: EntityMetadataAnalyzer;
  private readonly entityDocAnalyzer: EntityDocAnalyzer;
  private readonly namespaceFactory: NamespaceFactory;
  private readonly markdownWriter: MarkdownWriter;

  // constructor(config: ITypeormMarkdownConfig) {
  //   this.config = config;
  //   this.entityMetadataAnalyzer = new EntityMetadataAnalyzer(config);
  //   this.entityDocAnalyzer = new EntityDocAnalyzer();
  //   this.namespaceFactory = new NamespaceFactory();
  //   this.markdownWriter = new MarkdownWriter();
  // }

  constructor(datasource: DataSource, markdownConfig: ITypeormMarkdownConfig) {
    this.markdownConfig = markdownConfig;
    this.entityMetadataAnalyzer = new EntityMetadataAnalyzer(datasource);
    this.entityDocAnalyzer = new EntityDocAnalyzer();
    this.namespaceFactory = new NamespaceFactory();
    this.markdownWriter = new MarkdownWriter();
  }

  public async build(): Promise<void> {
    const entityPathFromRoot = `${await findProjectRoot()}/${this.markdownConfig.entityPath}`;
    const tables = await this.entityMetadataAnalyzer.analyze();
    const entityDocs = await this.entityDocAnalyzer.analyze(entityPathFromRoot);
    const namespaces = this.namespaceFactory.create(tables, entityDocs);

    this.markdownWriter.render(
      this.markdownConfig.title,
      this.markdownConfig.outFilePath,
      namespaces
    );
  }
}
