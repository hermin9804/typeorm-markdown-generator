import fs from "fs";
import { DataSource } from "typeorm";
import { MarkdownWriter } from "./writers/MarkdownWriter";
import { EntityDocAnalyzer } from "./analyzers/EntityDocAnalyzer";
import { EntityMetadataAnalyzer } from "./analyzers/EntityMetadataAnalyzer";
import { NamespaceFactory } from "./factorys/NamespaceFactory";

export class TypeormMarkdownGenerator {
  private dataSource: DataSource;
  private entityPath: string;

  constructor(dataSource: DataSource, entityPath: string) {
    this.dataSource = dataSource;
    this.entityPath = entityPath;
  }

  public async build(outputFilePath: string): Promise<void> {
    // Initialize data source
    const connection = await this.dataSource.initialize();

    // Create analyzers
    const entityMetadataAnalyzer = new EntityMetadataAnalyzer(connection);
    const entityDocAnalyzer = new EntityDocAnalyzer(this.entityPath);

    // Analyze metadata and documentation
    const tables = await entityMetadataAnalyzer.analyze();
    const entityDocs = entityDocAnalyzer.analyze();

    // Create namespaces
    const namespaceFactory = new NamespaceFactory();
    const namespaces = await namespaceFactory.create(tables, entityDocs);

    // Generate markdown content
    const markdownWriter = new MarkdownWriter(namespaces);
    const markdownContent = markdownWriter.render();

    // Write to output file
    fs.writeFileSync(outputFilePath, markdownContent);

    // Close the connection
    await connection.destroy();
  }
}
