import { ZodSchema } from "zod";
import { tool, DynamicStructuredTool } from "@langchain/core/tools";


type ToolConfig = {
  name: string;
  description: string;
  inputParams: ZodSchema<any>;
  execute: (input: any) => Promise<any>;

  isDynamic?: boolean;
};


export function createTool(config: ToolConfig) {
  const { name, description, inputParams, execute, isDynamic = false } = config;

  if (isDynamic) {
    return new DynamicStructuredTool({
      name,
      description,
      schema: inputParams,
      func: async (input: any) => await execute(input),
    });
  }

  return tool(
    async (input: any) => await execute(input),
    {
      name,
      description,
      schema: inputParams,
    }
  );
}

