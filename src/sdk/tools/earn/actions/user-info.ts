import { createAction } from "../../../helpers/createAction";
import { toolMessage } from "../../../helpers/common";
import { z } from "zod";

import { makeAxiosRequest } from "../common";

const METHOD = 'POST';
const URL_PATH = '/earn/user/info';

const earnUserInfo = async (inputParams: { username: string; }): Promise<string> => {
  try {
    const response = await makeAxiosRequest(METHOD, URL_PATH, inputParams);
    console.log(response);
    return toolMessage({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error(`Error fetching user info:`, error);
    return toolMessage({
      success: false,
      data: `Error: ${error}`,
    });
  }
};

export const earnUserInfoTool = createAction({
  name: "earnUserInfoTool",
  description: "Fetches user information based on the provided username from the Superteam Earn homepage.",
  inputParams: z.object({
    username: z.string().describe('Username of the user to fetch information for'),
  }),
  execute: earnUserInfo,
});