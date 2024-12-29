import { VityToolKit } from "../sdk";
import type { ToolConfig } from "../sdk/helpers/createAction";
import type { Action, App } from "../sdk/tools";
import type { StorageProvider } from "../storage-providers";
import { tool, type CoreTool } from "ai";


export class VercelAIToolkit extends VityToolKit {

    constructor({ userPrivateKey, appPrivateKey, storageProvider }: { userPrivateKey?: string, appPrivateKey?: string, storageProvider?: StorageProvider } = {}) {
        super({ userPrivateKey, appPrivateKey, storageProvider });
    }

    private schemaToTool(schemas: ToolConfig[]) {
        return schemas.map(schema => {
            const { name, description, inputParams, execute } = schema;

            const func = async (input: any) => await execute(input);

            return tool({
                description,
                parameters: inputParams || {}, // Ensure parameters are provided
                execute: func // Use the defined function
            });
        });
    }

    getTools({ apps, actions }: { apps?: App[], actions?: Action[] }) {
        const appTools = apps ? this._getApps(apps) : [];
        const actionTools = actions ? this._getActions(actions) : [];

        const schemaTools = this.schemaToTool([...appTools, ...actionTools]);
        const tools = schemaTools.reduce((acc, t, i) => {
            acc[`tool_${i}`] = t;
            return acc;
        }, {} as Record<string, CoreTool<any, any>>);

        return tools;
    }
}