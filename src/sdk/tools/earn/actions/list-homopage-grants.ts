import { createAction } from "../../../helpers/createAction";
import { toolMessage } from "../../../helpers/common";
import { z } from "zod";

import { makeAxiosRequest } from "../common";

const METHOD = 'POST';
const URL_PATH = '/earn/homepage/grants';

const earnListHomepageGrants = async (inputParams: { userRegion?: string[] | null; }): Promise<string> => {
  try {
    const response = await makeAxiosRequest(METHOD, URL_PATH, inputParams);
    console.log(response);
    return toolMessage({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error(`Error fetching grants:`, error);
    return toolMessage({
      success: false,
      data: `Error occurred while fetching grants.`,
    });
  }
};

export const earnListHomepageGrantsTool = createAction({
  name: "earnListHomepageGrantsTool",
  description: "Fetches grants based on user region and other criteria.",
  inputParams: z.object({
    userRegion: z.array(z.string()).optional().nullable().describe('Array of user regions to filter grants'),
  }),
  execute: earnListHomepageGrants,
});