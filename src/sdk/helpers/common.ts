
// For tool (action) messages which is returned after executing an action to the LLM
export interface IMessage {
    success: boolean;
    data?: any;
    message?: string;
}

export interface IToolMessage extends IMessage { }


export function toolMessage(options: IToolMessage) {
    // return options;
    return JSON.stringify(options);
}

// For integration and connection messages

export interface IIntegrationMessage extends IMessage { }
export interface IConnectionMessage extends IMessage { }

export function integrationMessage(options: IIntegrationMessage) {
    return options;
}

export function connectionMessage(options: IConnectionMessage) {
    return options;
}


