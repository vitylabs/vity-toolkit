import { createAction } from "../../../helpers/createAction";
import { toolMessage } from "../../../helpers/common";
import { z } from "zod";

import { makeAxiosRequest } from "../common";
import logger from "../../../utils/logger";

const METHOD = 'GET';
const URL_TEMPLATE = '/explore';

const gibworkExplore = async (inputParams: { page?: number; limit?: number; pageAll?: boolean; search?: string; orderBy?: string; tags?: string[]; }): Promise<string> => {
    const { page, limit, pageAll, search, orderBy, tags } = inputParams;
    const queryParams = new URLSearchParams();
    if (page !== undefined) queryParams.append('page', page.toString());
    if (limit !== undefined) queryParams.append('limit', limit.toString());
    if (pageAll !== undefined) queryParams.append('pageAll', pageAll.toString());
    if (search !== undefined) queryParams.append('search', search);
    if (orderBy !== undefined) queryParams.append('orderBy', orderBy);
    if (tags !== undefined && tags.length > 0) queryParams.append('tags', tags.join(','));

    const fullUrl = `${URL_TEMPLATE}?${queryParams.toString()}`;

    try {
        const response = await makeAxiosRequest(METHOD, fullUrl, null);
        logger.info(`Successfully fetched tasks from gibwork`);
        return toolMessage({
            success: true,
            data: response,
        });
    } catch (error) {
        logger.error(`Error fetching tasks from gibwork: ${error}`);
        return toolMessage({
            success: false,
            data: `Error occurred while fetching tasks.`,
        });
    }
};

export const gibworkExploreTool = createAction({
    name: "gibworkExploreTool",
    description: `View all available tasks on the gibwork platform`,
    inputParams: z.object({
        page: z.number().min(1).default(1).describe('Page number, defaults to 1'),
        limit: z.number().min(1).default(15).describe('Number of items per page, defaults to 15'),
        pageAll: z.boolean().default(false).describe('Fetch all pages, defaults to false'),
        search: z.string().min(1).optional().describe('Search query'),
        orderBy: z.string().optional().describe('Order by field, e.g. createdAt, isFeatured, -createdAt, -isFeatured (- for ascending order)'),
        tags: z.array(z.string()).optional().describe('List of tags'),
    }),
    execute: gibworkExplore,
});