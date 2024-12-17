import { createAction } from "../../../helpers/createAction";
import { toolMessage } from "../../../helpers/common";
import { z } from "zod";

import { makeAxiosRequest } from "../common";

const METHOD = 'GET';
const URL_PATH = '/feed/get';


const earnActivityFeed = async (inputParams: {
    timePeriod?: string;
    take?: number;
    skip?: number;
    isWinner?: string;
    filter?: string;
    userId?: string;
    highlightType?: string;
    highlightId?: string;
    takeOnlyType?: string;
}): Promise<string> => {
    const queryString = new URLSearchParams(
        Object.fromEntries(Object.entries(inputParams).map(([key, value]) => [key, String(value)]))
    ).toString();
    const fullUrl = `${URL_PATH}?${queryString}`;

    try {
        const response = await makeAxiosRequest(METHOD, fullUrl, null);
        console.log(response);
        return toolMessage({
            success: true,
            data: response.data,
        });
    } catch (error) {
        console.error(error);
        return toolMessage({
            success: false,
            data: `
                Error getting feed: ${error}
            `
        });
    }
}

export const earnActivityFeedTool = createAction({
    name: "earnActivityFeedTool",
    description: "Get the activity feed of users in superteam earn, like if someone submitted a bounty or added a new project in this profile, and much more",
    inputParams: z.object({
        timePeriod: z.string().optional().describe('Specifies the time period for filtering data (e.g., "this week", "this month")'),
        take: z.number().optional().describe('Number of records to retrieve (pagination limit)'),
        skip: z.number().optional().describe('Number of records to skip (pagination offset)'),
        isWinner: z.string().optional().describe('Filter for winners; use "true" to include only winners'),
        filter: z.string().optional().describe('Additional filter criteria'),
        userId: z.string().optional().describe('User ID to filter records by a specific user'),
        highlightType: z.string().optional().describe('Type of highlight (e.g., "post", "comment")'),
        highlightId: z.string().optional().describe('ID of the specific highlight item'),
        takeOnlyType: z.string().optional().describe('Filter to take only a specific type of item'),
    }),
    execute: earnActivityFeed,
});