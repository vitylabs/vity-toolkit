import { createAction } from "../../../helpers/createAction";
import { toolMessage } from "../../../helpers/common";
import { z } from "zod";

import { makeAxiosRequest } from "../common";

const METHOD = 'POST';
const URL_PATH = '/earn/user/public-stats';

const earnFetchUserPublicStats = async (inputParams: { username: string; }): Promise<string> => {
  try {
    const response = await makeAxiosRequest(METHOD, URL_PATH, inputParams);
    console.log(response);
    return toolMessage({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error(`Error fetching public stats:`, error);
    return toolMessage({
      success: false,
      data: `Error occurred while fetching public stats.`,
    });
  }
};

export const earnFetchUserPublicStatsTool = createAction({
  name: "earnFetchUserPublicStatsTool",
  description: "Fetches public statistics for a user, including participations and wins, based on the provided username from the Superteam Earn homepage.",
  inputParams: z.object({
    username: z.string().describe('Username of the user to fetch public statistics for'),
  }),
  execute: earnFetchUserPublicStats,
});