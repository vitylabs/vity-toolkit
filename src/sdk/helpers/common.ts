

export interface IToolMessage {
    success: boolean;
    data: any;
}


export function toolMessage(options: IToolMessage) {
    // return options;
    return JSON.stringify(options);
}


