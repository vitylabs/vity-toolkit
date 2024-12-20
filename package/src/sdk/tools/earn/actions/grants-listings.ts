import { createAction } from "../../../helpers/createAction";
import { toolMessage } from "../../../helpers/common";
import { z } from "zod";

import { makeAxiosRequest } from "../common";
import logger from "../../../utils/logger";

const METHOD = 'POST';
const URL_PATH = '/homepage/grants';

const earnGrantsListings = async (inputParams: { userRegion?: string[] | null; }): Promise<string> => {
  try {
    const response = await makeAxiosRequest(METHOD, URL_PATH, inputParams);
    logger.info(`Successfully fetched grants`);
    return toolMessage({
      success: true,
      data: response,
    });
  } catch (error) {
    logger.error(`Error fetching grants:`, error);
    return toolMessage({
      success: false,
      data: `Error occurred while fetching grants.`,
    });
  }
};

export const earnGrantsListingsTool = createAction({
  name: "earnGrantsListingsTool",
  description: "Fetches list of grants based on user region and other criteria from Superteam Earn.",
  inputParams: z.object({
    userRegion: z.array(z.string()).optional().nullable().describe('Array of user regions to filter grants'),
  }),
  execute: earnGrantsListings,
});