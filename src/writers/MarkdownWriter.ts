import fs from "fs";
import path from "path";
import { IClassDoc, INamespace } from "../structures";
import { MermaidErdWriter } from "./MermaidErdWriter";

export class MarkdownWriter {
  private readonly mermaidErdWriter: MermaidErdWriter;
  private lines: string[];

  constructor() {
    this.mermaidErdWriter = new MermaidErdWriter();
    this.lines = [];
  }

  public render(
    title: string = "ERD",
    outFilePath: string = "ERD.md",
    namespaces: INamespace[]
  ) {
    this.lines = [];

    this.writeHeader(title);
    this.writeTOC(namespaces);
    this.writeBodyContent(namespaces);

    const directory = path.dirname(outFilePath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    fs.writeFileSync(outFilePath, this.lines.join("\n"));
  }

  private writeHeader(title: string): void {
    this.lines.push(`# ${title}\n`);
    this.lines.push(
      "> Generated by [`typeorm-markdown`](https://github.com/hermin9804/typeorm-markdown)\n"
    );
    this.lines.push("\n");
  }

  private writeTOC(namespaces: INamespace[]): void {
    this.lines.push("## Table of Contents\n");
    this.lines.push("\n");

    namespaces.forEach((namespace) => {
      this.lines.push(
        `- [${namespace.name}](#${namespace.name.toLowerCase()})`
      );
    });

    this.lines.push("\n");
  }

  private writeBodyContent(namespaces: INamespace[]): void {
    namespaces.forEach((namespace) => {
      this.lines.push(`## ${namespace.name}\n`);
      this.writeMermaidErd(namespace);
      namespace.classDocs.forEach((doc) => {
        this.writeDocumentContent(doc);
      });
    });
  }

  private writeMermaidErd(namespace: INamespace): void {
    const erdDiagram = this.mermaidErdWriter.render(namespace.tables);
    this.lines.push("```mermaid\n" + erdDiagram + "\n```\n");
  }

  private writeDocumentContent(doc: IClassDoc): void {
    this.lines.push(`### ${doc.name}\n`);
    this.lines.push(`${doc.docs.join(" ")}\n`);
    this.lines.push("**Properties**\n");

    doc.properties.forEach((prop: any) => {
      this.lines.push(`  - \`${prop.name}\`: ${prop.docs.join(" ")}`);
    });

    this.lines.push("\n");
  }
}
