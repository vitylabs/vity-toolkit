import { createAction } from "../../../helpers/createAction";
import { toolMessage } from "../../../helpers/common";
import { z } from "zod";

import { makeAxiosRequest } from "../common";

const METHOD = 'POST';
const URL_PATH = '/earn/grants/sponsor';

const earnFetchSponsorGrants = async (inputParams: { sponsor: string; }): Promise<string> => {
  const { sponsor } = inputParams;

  try {
    const response = await makeAxiosRequest(METHOD, URL_PATH, { sponsor });
    console.log(response);
    return toolMessage({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error(`Error fetching sponsor grants:`, error);
    return toolMessage({
      success: false,
      data: `Error occurred while fetching sponsor grants.`,
    });
  }
};

export const earnFetchSponsorGrantsTool = createAction({
  name: "earnFetchSponsorGrantsTool",
  description: "Fetches grants associated with a specific sponsor in Superteam Earn.",
  inputParams: z.object({
    sponsor: z.string().describe('Name of the sponsor'),
  }),
  execute: earnFetchSponsorGrants,
});