import { createAction } from "../../../helpers/createAction";
import { toolMessage } from "../../../helpers/common";
import { z } from "zod";

import { makeAxiosRequest } from "../common";
import logger from "../../../utils/logger";

const METHOD = 'GET';
const URL_PATH = '/user/search';

const earnSearchUsers = async (inputParams: { query: string; takeNum?: number }): Promise<string> => {
  const { query, takeNum } = inputParams;
  const fullUrl = `${URL_PATH}?query=${query}&take=${takeNum}`;

  try {
    const response = await makeAxiosRequest(METHOD, fullUrl, null);
    logger.info(`Successfully searched for user`);
    return toolMessage({
      success: true,
      data: response,
    });
  } catch (error) {
    logger.error(`Error searching for users:`, error);
    return toolMessage({
      success: false,
      data: `Error occurred while searching for users.`,
    });
  }
};

export const earnSearchUsersTool = createAction({
  name: "earnSearchUsersTool",
  description: `Searches for user's details based on a query string, that can be a username, first name, or last name from the Superteam Earn homepage.
  If the tool is successful, it will return the user's id, username, first name, last name, and profile picture.`,
  inputParams: z.object({
    query: z.string().describe('Query string to search for users'),
    takeNum: z.number().optional().describe('Number of users to retrieve'),
  }),
  execute: earnSearchUsers,
});