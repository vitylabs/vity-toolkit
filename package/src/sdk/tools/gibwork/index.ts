import { gibworkCreateTaskTool } from "./actions/create-task";
import { gibworkExploreTool } from "./actions/explore";
import { gibworkTasksTool } from "./actions/tasks";


export class GibworkTool {

    getTools() {
        return [
            gibworkExploreTool,
            gibworkTasksTool,
            gibworkCreateTaskTool
        ]
    }

}


