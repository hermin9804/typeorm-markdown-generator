import { ClassDeclaration, Project, ts } from "ts-morph";
import { IClassDoc } from "../structures";

export class EntityDocAnalyzer {
  private sourceFilePath: string;

  constructor(sourceFilePath: string) {
    this.sourceFilePath = sourceFilePath;
  }

  public async analyze(): Promise<IClassDoc[]> {
    const result: IClassDoc[] = [];
    const project = await this.loadProject();
    const sourceFiles = project.getSourceFiles();
    sourceFiles.forEach((sourceFile) => {
      sourceFile.getClasses().forEach((cls) => {
        result.push(this.createEntity(cls));
      });
    });
    return result;
  }

  private async loadProject(): Promise<Project> {
    const project = new Project();
    project.addSourceFilesAtPaths(this.sourceFilePath);
    if (project.getSourceFiles().length === 0) {
      throw new Error("No source files found.");
    }
    return project;
  }

  private createEntity(cls: ClassDeclaration): IClassDoc {
    return {
      name: this.extractEntityName(cls),
      docs: cls.getJsDocs().map((doc) => doc.getInnerText().trim()),
      namespaces: this.extractNamespaces(cls),
      properties: cls.getProperties().map((prop) => ({
        name: prop.getName(),
        docs: prop.getJsDocs().map((doc) => doc.getInnerText().trim()),
      })),
    };
  }

  private extractEntityName(cls: ClassDeclaration): string {
    return (
      this.extractEntityDecoratorNameParameter(cls) ??
      this.extractClassName(cls)
    );
  }

  /**
   * '@Entity("user")'에서 entity name을 추출하는 함수
   */
  private extractEntityDecoratorNameParameter(
    cls: ClassDeclaration
  ): string | null {
    const entityDecorator = cls.getDecorator("Entity");
    if (!entityDecorator) return null;
    const args = entityDecorator.getArguments();
    if (args.length > 0 && args[0].getKind() === ts.SyntaxKind.StringLiteral) {
      return args[0].getText().slice(1, -1); // 문자열 리터럴에서 따옴표 제거
    }
    return null;
  }

  private extractClassName(cls: ClassDeclaration): string {
    const className = cls.getName();
    if (!className) throw new Error("Entity class must have a name.");
    return this.transformToSnakeCase(className);
  }

  private transformToSnakeCase(name: string): string {
    return name
      .replace(/([A-Z])/g, "_$1")
      .toLowerCase()
      .substring(1);
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
