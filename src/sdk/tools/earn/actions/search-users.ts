import { createAction } from "../../../helpers/createAction";
import { toolMessage } from "../../../helpers/common";
import { z } from "zod";

import { makeAxiosRequest } from "../common";

const METHOD = 'GET';
const URL_PATH = '/earn/user/search';

const earnSearchUsers = async (inputParams: { query: string; takeNum: number; }): Promise<string> => {
  const { query, takeNum } = inputParams;
  const fullUrl = `${URL_PATH}?query=${query}&takeNum=${takeNum}`;

  try {
    const response = await makeAxiosRequest(METHOD, fullUrl, null);
    console.log(response);
    return toolMessage({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error(`Error searching for users:`, error);
    return toolMessage({
      success: false,
      data: `Error occurred while searching for users.`,
    });
  }
};

export const earnSearchUsersTool = createAction({
  name: "earnSearchUsersTool",
  description: "Searches for users based on a query string, including username, first name, and last name from the Superteam Earn homepage.",
  inputParams: z.object({
    query: z.string().describe('Query string to search for users'),
    takeNum: z.number().describe('Number of users to retrieve'),
  }),
  execute: earnSearchUsers,
});