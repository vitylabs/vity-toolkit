import { type AnyZodObject } from "zod";
// import { tool, DynamicStructuredTool } from "@langchain/core/tools";


export type ToolConfig = {
  name: string;
  description: string;
  inputParams: AnyZodObject;
  execute: (input: any) => Promise<any>;

  isDynamic?: boolean;
};


export function createAction(config: ToolConfig): ToolConfig {
  const { name, description, inputParams, execute } = config;

  // if (isDynamic) { // Dynamic tools are used when the schema is not known at compile time
  //   return new DynamicStructuredTool({
  //     name,
  //     description,
  //     schema: inputParams as AnyZodObject,
  //     func: async (input: any) => await execute(input),
  //   });
  // }

  // return tool(
  //   async (input: any) => await execute(input),
  //   {
  //     name,
  //     description,
  //     schema: inputParams as AnyZodObject,
  //   }
  // );

  return {
    name,
    description,
    inputParams: inputParams as AnyZodObject,
    execute: async (input: any) => await execute(input),
  }
}

