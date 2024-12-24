import { z } from "zod";
import { RedditTool } from "..";
import { createAction } from "../../../helpers/createAction";
import { toolMessage, unPromise } from "../../../helpers/common";


const redditDeletePost = async (inputParams: { postId: string }): Promise<string> => {
    try {
        const redditTool = new RedditTool();
        const redditClient = await redditTool.createClient();
        if (!redditClient) {
            throw new Error("Reddit client is not initialized");
        }
        
        // logic to create a post
        const result = await unPromise(redditClient.getSubmission(inputParams.postId).delete());

        return toolMessage({
            success: true,
            message: `Created post with id: ${result.id}`,
        });
    } catch (error: any) {
        return toolMessage({
            success: false,
            data: error.message,
        });
    }
}

export const redditDeletePostTool = createAction({
    name: "redditDeletePostTool",
    description: "Delete a post in reddit.",
    inputParams: z.object({
        postId: z.string().describe("The post id to delete"),
    }),
    execute: redditDeletePost,
});


