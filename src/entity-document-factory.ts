// import fs from "fs";
import { Project } from "ts-morph";
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
            tags: cls.getJsDocs().flatMap((doc) =>
              doc.getTags().map((tag) => ({
                name: tag.getTagName(),
                text: tag.getCommentText() ?? "",
              }))
            ),
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
}

// Use the factory to create the entity documents and save the result to a JSON file
// const sourceFilePath = "src/entities/*.ts";
// const factory = new EntityDocumentFactory(sourceFilePath);
// const entityDocuments = factory.createEntityDocument();
// fs.writeFileSync("comments.json", JSON.stringify(entityDocuments, null, 2));
