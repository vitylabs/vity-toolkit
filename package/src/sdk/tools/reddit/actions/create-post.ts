import { z } from "zod";
import { RedditTool } from "..";
import { createAction } from "../../../helpers/createAction";
import { toolMessage, unPromise } from "../../../helpers/common";


const redditCreatePost = async (inputParams: { subreddit: string; title: string; text: string }): Promise<string> => {
    try {
        const redditTool = new RedditTool();
        const redditClient = await redditTool.createClient();
        if (!redditClient) {
            throw new Error("Reddit client is not initialized");
        }

        // logic to create a post
        const message: string = await unPromise(redditClient.getSubreddit(inputParams.subreddit).submitSelfpost({
            subredditName: inputParams.subreddit,
            title: inputParams.title,
            text: inputParams.text,
        }).then((post) => {
            return toolMessage({
                success: true,
                message: `Created post with id: ${post.id}`,
            });
        }).catch((error) => {
            return toolMessage({
                success: false,
                data: error.message,
            });
        })) as string;

        return message;
    } catch (error: any) {
        return toolMessage({
            success: false,
            data: error.message,
        });
    }
}

export const redditCreatePostTool = createAction({
    name: "redditCreatePostTool",
    description: "Create a new post in a subreddit.",
    inputParams: z.object({
        subreddit: z.string().describe("The subreddit name for the post"),
        title: z.string().describe("Title for the post"),
        text: z.string().describe("The text for the post"),
    }),
    execute: redditCreatePost,
});


