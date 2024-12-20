import { createAction } from "../../../helpers/createAction";
import { toolMessage } from "../../../helpers/common";
import { z } from "zod";

import { makeAxiosRequest } from "../common";
import logger from "../../../utils/logger";

const METHOD = 'POST';
const URL_PATH = '/grants/sponsor';

const earnFetchExclusiveSponsorGrants = async (inputParams: { sponsor: string; }): Promise<string> => {
  const { sponsor } = inputParams;

  try {
    const response = await makeAxiosRequest(METHOD, URL_PATH, { sponsor });
    logger.info(`Successfully fetched sponsor grants`);
    return toolMessage({
      success: true,
      data: response,
    });
  } catch (error) {
    logger.error(`Error fetching sponsor grants:`, error);
    return toolMessage({
      success: false,
      data: `Error occurred while fetching sponsor grants.`,
    });
  }
};

export const earnFetchExclusiveSponsorGrantsTool = createAction({
  name: "earnFetchExclusiveSponsorGrantsTool",
  description: "Fetches grants associated with exclusive sponsor in Superteam Earn.",
  inputParams: z.object({
    sponsor: z.string().describe('Name of the sponsor, like solana-gaming, pyth, dreader, ns, soon, jup'),
  }),
  execute: earnFetchExclusiveSponsorGrants,
});