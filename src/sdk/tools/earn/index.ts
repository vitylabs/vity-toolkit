import { earnActivityFeedTool } from "./actions/activity_feed"


export class EarnTool {

    constructor() {
    }

    getTools() {
        return [
            earnActivityFeedTool,
        ]
    }

}


