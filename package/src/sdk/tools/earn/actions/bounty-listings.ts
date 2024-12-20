import { createAction } from "../../../helpers/createAction";
import { toolMessage } from "../../../helpers/common";
import { z } from "zod";

import { makeAxiosRequest } from "../common";
import logger from "../../../utils/logger";

const METHOD = 'POST';
const URL_PATH = '/homepage/listings';

const earnBountyListings = async (inputParams: {
  order?: 'asc' | 'desc';
  statusFilter?: string;
  userRegion?: string[] | null;
  excludeIds?: string[];
}): Promise<string> => {
  try {
    const response = await makeAxiosRequest(METHOD, URL_PATH, inputParams);
    logger.info(`Successfully fetched listings`);
    return toolMessage({
      success: true,
      data: response,
    });
  } catch (error) {
    logger.error(`Error fetching listings:`, error);
    return toolMessage({
      success: false,
      data: `Error occurred while fetching listings.`,
    });
  }
};

export const earnBountyListingsTool = createAction({
  name: "earnBountyListingsTool",
  description: "Fetches all the bounty listings based on various filters and criteria from the Superteam Earn homepage.",
  inputParams: z.object({
    order: z.enum(['asc', 'desc']).optional().describe('Order of the listings, e.g., "asc" or "desc"'),
    statusFilter: z.string().optional().describe('Status filter for the listings'),
    userRegion: z.array(z.string()).optional().nullable().describe('Array of user regions to filter listings'),
    excludeIds: z.array(z.string()).optional().describe('Array of listing IDs to exclude'),
  }),
  execute: earnBountyListings,
});