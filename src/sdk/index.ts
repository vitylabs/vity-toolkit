import { toolMessage, type IToolMessage } from "./helpers/common";
import { getPublicKey } from "./helpers/getPublicKey";
import { Action, actionsMap } from "./tools";
import VityToolKitSDKContext from "./utils/vityToolKitContext";


export class VityToolKit {

    constructor(privateKey?: string, chain: string = "solana") {
        if (privateKey) {
            VityToolKitSDKContext.privateKey = privateKey;
            VityToolKitSDKContext.publicKey = getPublicKey(privateKey);
        }
    }

    async getActions(actions: Action[]) {
        return actions.map(action => actionsMap[action]);
    }

    async executeAction(action: Action, innputParams: object = {}): Promise<IToolMessage> {
        try {
            const result = await actionsMap[action].invoke(innputParams);
            return JSON.parse(result) as IToolMessage;
        } catch (error: any) {
            console.error(error);

            const message = toolMessage({
                success: false,
                data: error.message,
            });

            return JSON.parse(message) as IToolMessage;
        }
    }

}


