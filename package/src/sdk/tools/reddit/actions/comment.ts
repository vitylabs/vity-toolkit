import { z } from "zod";
import { RedditTool } from "..";
import { createAction } from "../../../helpers/createAction";
import { toolMessage, unPromise } from "../../../helpers/common";


const redditComment = async (inputParams: { post_id: string, type: string, message: string }): Promise<string> => {
    try {
        const redditTool = new RedditTool();
        const redditClient = await redditTool.createClient();
        if (!redditClient) {
            throw new Error("Reddit client is not initialized");
        }
        
        // logic to comment on the posts
        if (inputParams.type === "submission") {
            const post = await unPromise(redditClient.getSubmission(inputParams.post_id));
            post.reply(inputParams.message);
        }
        else if (inputParams.type === "comment") {
            const post = await unPromise(redditClient.getComment(inputParams.post_id));
            post.reply(inputParams.message);
        }
        else {
            throw new Error("Invalid type of post to comment on");
        }

        return toolMessage({
            success: true,
            message: "Commented on the post successfully",
        });
    } catch (error: any) {
        return toolMessage({
            success: false,
            data: error.message,
        });
    }
}

export const redditCommentTool = createAction({
    name: "redditCommentTool",
    description: "Comment on a post in a subreddit.",
    inputParams: z.object({
        post_id: z.string().describe("The post to comment on"),
        type: z.string().default("submission").describe("The type of post to comment on like submission or comment"),
        message: z.string().describe("The comment to make")
    }),
    execute: redditComment,
});


