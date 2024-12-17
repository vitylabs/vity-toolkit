import { createAction } from "../../../helpers/createAction";
import { toolMessage } from "../../../helpers/common";
import { z } from "zod";

import { makeAxiosRequest } from "../common";
import logger from "../../../../utils/logger";

const METHOD = 'GET';
const URL_PATH = '/homepage/user-count';

const earnTotalUserCount = async (): Promise<string> => {
  try {
    const response = await makeAxiosRequest(METHOD, URL_PATH, null);
    logger.info(`Successfully fetched user count`);
    return toolMessage({
      success: true,
      data: response,
    });
  } catch (error) {
    logger.error(`Error fetching user count:`, error);
    return toolMessage({
      success: false,
      data: `Error occurred while fetching user count.`,
    });
  }
};

export const earnTotalUserCountTool = createAction({
  name: "earnTotalUserCountTool",
  description: "Fetches the total user count from the Superteam Earn.",
  inputParams: z.object({}),
  execute: earnTotalUserCount,
});