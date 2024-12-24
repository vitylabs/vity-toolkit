
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

// For unpromising the promise
// This is used to remove the then, catch, finally methods from the promise object
export const unPromise = async <T>(promise: Promise<T>) => {
    const result = await promise;
    return result as Omit<T, 'then' | 'catch' | 'finally'>;
};


