import { createAction } from "../../../helpers/createAction";
import { toolMessage } from "../../../helpers/common";
import { z } from "zod";

import { makeAxiosRequest } from "../common";
import logger from "../../../utils/logger";

const METHOD = 'GET';
const URL_TEMPLATE = '/feed/{type}/{id}/get';

const earnFetchFeed = async (inputParams: { type: string; id: string; }): Promise<string> => {
  const { type, id } = inputParams;
  const fullUrl = URL_TEMPLATE.replace('{type}', type).replace('{id}', id);

  try {
    const response = await makeAxiosRequest(METHOD, fullUrl, null);
    logger.info(`Successfully fetched feed post of type ${type} with ID ${id}`);
    return toolMessage({
      success: true,
      data: response,
    });
  } catch (error) {
    logger.error(`Error fetching feed post of type ${type} with ID ${id}: ${error}`);
    return toolMessage({
      success: false,
      data: `Error occurred while fetching feed post.`,
    });
  }
};

export const earnFetchFeedTool = createAction({
  name: "earnFetchFeedTool",
  description: `Fetches feed for a type (submission, pow, grant-application) and feed ID from Superteam Earn. It gives submission details with relative more submissions to the listing/bounty.`,
  inputParams: z.object({
    type: z.string().describe('Type of the feed post (e.g., submission, pow, grant-application)'),
    id: z.string().uuid().describe('ID of the feed (like 747224bf-1d61-4b98-adc9-52e965cd455c)'),
  }),
  execute: earnFetchFeed,
});
