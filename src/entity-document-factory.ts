import { ClassDeclaration, Project } from "ts-morph";
import { IEntityDocument } from "./types";

export class EntityDocumentFactory {
  private readonly project: Project;

  constructor(sourceFilePath: string) {
    this.project = new Project();
    this.project.addSourceFilesAtPaths(sourceFilePath);
  }

  public createEntityDocument(): IEntityDocument[] {
    const result: IEntityDocument[] = [];
    this.project.getSourceFiles().forEach((sourceFile) => {
      sourceFile.getClasses().forEach((cls) => {
        const className = cls.getName();
        if (className) {
          const entity: IEntityDocument = {
            name: className,
            docs: cls.getJsDocs().map((doc) => doc.getInnerText().trim()),
            namespaces: this.extractNamespaces(cls),
            properties: [],
          };
          cls.getProperties().forEach((prop) => {
            entity.properties.push({
              name: prop.getName(),
              docs: prop.getJsDocs().map((doc) => doc.getInnerText().trim()),
            });
          });
          result.push(entity);
        }
      });
    });
    return result;
  }

  private extractNamespaces(cls: ClassDeclaration): string[] {
    const result: string[] = [];
    cls.getJsDocs().forEach((doc) => {
      doc.getTags().forEach((tag) => {
        if (tag.getTagName() === "namespace") {
          result.push(tag.getCommentText() ?? "");
        }
      });
    });
    if (result.length === 0) result.push("UnknownNamespace");
    return result;
  }
}
