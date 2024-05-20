import { INamespace } from "../structures";
import { MermaidErdWriter } from "./MermaidErdWriter";

export class MarkdownWriter {
  private namespaces: INamespace[];

  constructor(namespaces: INamespace[]) {
    this.namespaces = namespaces;
  }

  public render(): string {
    const markdownLines: string[] = [];

    markdownLines.push(
      "> Generated by [`typeorm-markdown`](https://github.com/hermin9804/typeorm-markdown)\n"
    );

    this.generateTOC(markdownLines);
    this.generateBodyContent(markdownLines);

    return markdownLines.join("\n");
  }

  private generateTOC(markdownLines: string[]): void {
    markdownLines.push("\n");

    this.namespaces.forEach((aggregate) => {
      markdownLines.push(
        `- [${aggregate.namespace}](#${aggregate.namespace.toLowerCase()})`
      );
    });

    markdownLines.push("\n");
  }

  private generateBodyContent(markdownLines: string[]): void {
    this.namespaces.forEach((aggregate) => {
      markdownLines.push(`## ${aggregate.namespace}\n`);
      const mermaidErd = new MermaidErdWriter(aggregate.tables);
      const erdDiagram = mermaidErd.render();
      markdownLines.push("```mermaid\n" + erdDiagram + "\n```\n");

      aggregate.classDocs.forEach((doc) => {
        this.generateDocumentContent(markdownLines, doc);
      });
    });
  }

  private generateDocumentContent(markdownLines: string[], doc: any): void {
    markdownLines.push(`### ${doc.name}\n`);
    markdownLines.push(`${doc.docs.join(" ")}\n`);
    markdownLines.push("**Properties**\n");

    doc.properties.forEach((prop: any) => {
      markdownLines.push(`  - \`${prop.name}\`: ${prop.docs.join(" ")}`);
    });

    markdownLines.push("\n");
  }
}