import { createAction } from "../../../helpers/createAction";
import { toolMessage } from "../../../helpers/common";
import { z } from "zod";

import { makeAxiosRequest } from "../common";
import logger from "../../../utils/logger";

const METHOD = 'POST';
const URL_PATH = '/user/public-stats';

const earnFetchUserPublicStats = async (inputParams: { username: string; }): Promise<string> => {
  try {
    const response = await makeAxiosRequest(METHOD, URL_PATH, inputParams);
    logger.info(`Successfully fetched public stats for user ${inputParams.username}`);
    return toolMessage({
      success: true,
      data: response,
    });
  } catch (error) {
    logger.error(`Error fetching public stats for user ${inputParams.username}: ${error}`);
    return toolMessage({
      success: false,
      data: `Error occurred while fetching public stats.`,
    });
  }
};

export const earnFetchUserPublicStatsTool = createAction({
  name: "earnFetchUserPublicStatsTool",
  description: "Fetches public statistics for a user like participations, wins and totalWinnings (amount) he/she won, based on the provided username from the Superteam Earn.",
  inputParams: z.object({
    username: z.string().describe('Username of the user to fetch public statistics for'),
  }),
  execute: earnFetchUserPublicStats,
});