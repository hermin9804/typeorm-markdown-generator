#!/usr/bin/env ts-node

import fs from "fs";
import path from "path";
import { Command } from "commander";
import { TypeormMarkdownGenerator } from "../TypeormMarkdownGenerator";
import { ITypeormMarkdownConfig } from "../structures";
import { validateConfig } from "../utils/validateConfig";

const program = new Command();

program
  .option(
    "-c, --config <path>",
    "specify config file path",
    "typeorm-markdown.json"
  )
  .parse(process.argv);

const options = program.opts();
const configPath = path.resolve(process.cwd(), options.config);

// Ensure the config file exists
if (!fs.existsSync(configPath)) {
  console.error(
    `Config file not found at ${configPath}. Please create a ${options.config} file in the root of your project.`
  );
  process.exit(1);
}

// Read and parse the config file
let config: ITypeormMarkdownConfig;
try {
  const configFile = fs.readFileSync(configPath, "utf-8");
  config = JSON.parse(configFile) as ITypeormMarkdownConfig;
} catch (error) {
  console.error(`Error reading config file at ${configPath}:`, error);
  process.exit(1);
}

// Validate required configuration
if (!validateConfig(config)) {
  process.exit(1);
}

const main = async () => {
  try {
    const typeormMarkdown = new TypeormMarkdownGenerator(config, configPath);
    await typeormMarkdown.build();
    console.log("Document generated successfully.");
  } catch (error) {
    console.error("Error generating document:", error);
  }
};

main();
