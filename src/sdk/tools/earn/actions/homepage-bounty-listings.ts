import { createAction } from "../../../helpers/createAction";
import { toolMessage } from "../../../helpers/common";
import { z } from "zod";

import { makeAxiosRequest } from "../common";

const METHOD = 'POST';
const URL_PATH = '/earn/homepage/listings';

const earnHomepageBountyListings = async (inputParams: {
  order?: 'asc' | 'desc';
  statusFilter?: string;
  userRegion?: string[] | null;
  excludeIds?: string[];
}): Promise<string> => {
  try {
    const response = await makeAxiosRequest(METHOD, URL_PATH, inputParams);
    console.log(response);
    return toolMessage({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error(`Error fetching listings:`, error);
    return toolMessage({
      success: false,
      data: `Error occurred while fetching listings.`,
    });
  }
};

export const earnHomepageBountyListingsTool = createAction({
  name: "earnHomepageBountyListingsTool",
  description: "Fetches bounty listings based on various filters and criteria from the Superteam Earn homepage.",
  inputParams: z.object({
    order: z.enum(['asc', 'desc']).optional().describe('Order of the listings'),
    statusFilter: z.string().optional().describe('Status filter for the listings'),
    userRegion: z.array(z.string()).optional().nullable().describe('Array of user regions to filter listings'),
    excludeIds: z.array(z.string()).optional().describe('Array of listing IDs to exclude'),
  }),
  execute: earnHomepageBountyListings,
});