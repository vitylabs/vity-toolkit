import { z } from "zod";
import { RedditTool } from "..";
import { createAction } from "../../../helpers/createAction";
import { toolMessage } from "../../../helpers/common";
import type { Submission } from "snoowrap";


const redditFilter = async (inputParams: { subreddit: string, query: string[], limit?: number, sort?: string, time?: string }): Promise<string> => {
    try {
        const redditTool = new RedditTool();
        const redditClient = await redditTool.createClient();
        if (!redditClient) {
            throw new Error("Reddit client is not initialized");
        }
        
        // logic to filter the posts
        const searchTweets = await redditClient.search({
            subreddit: inputParams.subreddit,
            query: inputParams.query.join(" "),
            sort: inputParams.sort as 'relevance' | 'hot' | 'top' | 'new' | 'comments',
            time: inputParams.time as 'hour' | 'day' | 'week' | 'month' | 'year' | 'all' | undefined,
            limit: inputParams.limit,
        })

        let posts: Submission[] = [];
        for (const post of searchTweets) {
            posts.push(post);
        }

        return toolMessage({
            success: true,
            data: posts,
        });
    } catch (error: any) {
        return toolMessage({
            success: false,
            data: error.message,
        });
    }
}

export const redditFilterTool = createAction({
    name: "redditSearchTool",
    description: "Filter the posts in a subreddit by a query.",
    inputParams: z.object({
        subreddit: z.string().describe("The subreddit to filter"),
        query: z.array(z.string()).describe("The query to filter by"),
        sort: z.string().default("new").describe("The sorting method can be one of: new, hot, top, relevance, or comments"),
        limit: z.number().default(5).describe("The number of posts to return"),
        time: z.string().default("all").describe("The time filter can be one of: all, day, hour, month, week, or year")
    }),
    execute: redditFilter,
});


