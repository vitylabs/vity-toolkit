import { createAction } from "../../../helpers/createAction";
import { toolMessage } from "../../../helpers/common";
import { z } from "zod";

import { makeAxiosRequest } from "../common";
import logger from "../../../utils/logger";

const METHOD = 'GET';
const URL_TEMPLATE = '/pow/get?userId={userId}';

const earnFetchUserPoWs = async (inputParams: { userId: string; }): Promise<string> => {
  const { userId } = inputParams;
  const fullUrl = URL_TEMPLATE.replace('{userId}', userId);

  try {
    const response = await makeAxiosRequest(METHOD, fullUrl, null);
    logger.info(`Successfully fetched PoWs of user`);
    return toolMessage({
      success: true,
      data: response,
    });
  } catch (error) {
    logger.error(`Error fetching PoWs of user:`, error);
    return toolMessage({
      success: false,
      data: `Error occurred while fetching PoWs.`,
    });
  }
};

export const earnFetchUserPoWsTool = createAction({
  name: "earnFetchUserPoWsTool",
  description: `Fetches Proofs of Work (PoWs) for a specific user based on the provided user ID (like 8bf27154-1871-40a7-892c-5f6fd338ff09) from Superteam Earn.
  Pro Tip: If you have username of the user, you can use the search users tool to get the user ID.`,
  inputParams: z.object({
    userId: z.string().describe('User ID to fetch PoWs (like 8bf27154-1871-40a7-892c-5f6fd338ff09)'),
  }),
  execute: earnFetchUserPoWs,
});