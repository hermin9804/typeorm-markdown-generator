import path from "path";
import { MarkdownWriter } from "./writers/MarkdownWriter";
import { EntityDocAnalyzer } from "./analyzers/EntityDocAnalyzer";
import { EntityMetadataAnalyzer } from "./analyzers/EntityMetadataAnalyzer";
import { NamespaceFactory } from "./factorys/NamespaceFactory";
import { ITypeormMarkdownConfig } from "./structures";

export class TypeormMarkdownGenerator {
  private readonly config: ITypeormMarkdownConfig;
  private readonly entityPathFromRoot: string;
  private readonly entityMetadataAnalyzer: EntityMetadataAnalyzer;
  private readonly entityDocAnalyzer: EntityDocAnalyzer;
  private readonly namespaceFactory: NamespaceFactory;
  private readonly markdownWriter: MarkdownWriter;

  constructor(config: ITypeormMarkdownConfig, entityPathFromRoot: string) {
    this.config = config;
    this.entityPathFromRoot = entityPathFromRoot;
    this.entityMetadataAnalyzer = new EntityMetadataAnalyzer(config);
    this.entityDocAnalyzer = new EntityDocAnalyzer(this.entityPathFromRoot);
    this.namespaceFactory = new NamespaceFactory();
    this.markdownWriter = new MarkdownWriter();
  }

  public async build(): Promise<void> {
    const tables = await this.entityMetadataAnalyzer.analyze();
    const entityDocs = await this.entityDocAnalyzer.analyze();
    const namespaces = this.namespaceFactory.create(tables, entityDocs);

    this.markdownWriter.render(
      this.config.title,
      this.config.outFilePath,
      namespaces
    );
  }
}
