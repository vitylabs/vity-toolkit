import { createAction } from "../../../helpers/createAction";
import { toolMessage } from "../../../helpers/common";
import { z } from "zod";

import { makeAxiosRequest } from "../common";

const METHOD = 'GET';
const URL_TEMPLATE = '/earn/pow/get?userId={userId}';

const earnFetchUserPoWs = async (inputParams: { userId: string; }): Promise<string> => {
  const { userId } = inputParams;
  const fullUrl = URL_TEMPLATE.replace('{userId}', userId);

  try {
    const response = await makeAxiosRequest(METHOD, fullUrl, null);
    console.log(response);
    return toolMessage({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error(`Error fetching PoWs:`, error);
    return toolMessage({
      success: false,
      data: `Error occurred while fetching PoWs.`,
    });
  }
};

export const earnFetchUserPoWsTool = createAction({
  name: "earnFetchUserPoWsTool",
  description: "Fetches Proofs of Work (PoWs) for a specific use based on the provided user ID from the Superteam Earn homepage.",
  inputParams: z.object({
    userId: z.string().describe('User ID to fetch PoWs for'),
  }),
  execute: earnFetchUserPoWs,
});