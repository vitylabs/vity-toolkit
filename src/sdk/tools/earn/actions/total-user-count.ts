import { createAction } from "../../../helpers/createAction";
import { toolMessage } from "../../../helpers/common";
import { z } from "zod";

import { makeAxiosRequest } from "../common";

const METHOD = 'GET';
const URL_PATH = '/earn/homepage/user-count';

const earnTotalUserCount = async (): Promise<string> => {
  try {
    const response = await makeAxiosRequest(METHOD, URL_PATH, null);
    console.log(response);
    return toolMessage({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error(`Error fetching user count:`, error);
    return toolMessage({
      success: false,
      data: `Error occurred while fetching user count.`,
    });
  }
};

export const earnTotalUserCountTool = createAction({
  name: "earnTotalUserCountTool",
  description: "Fetches the total user count from the Superteam Earn homepage.",
  inputParams: z.object({}),
  execute: earnTotalUserCount,
});