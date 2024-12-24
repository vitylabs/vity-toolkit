import { createAction } from "../../../helpers/createAction";
import { toolMessage } from "../../../helpers/common";
import { z } from "zod";

import { makeAxiosRequest } from "../common";
import logger from "../../../utils/logger";

const METHOD = 'GET';
const URL_TEMPLATE = '/grants/{slug}';

const earnFetchGrantDetails = async (inputParams: { slug: string; }): Promise<string> => {
  const { slug } = inputParams;
  const fullUrl = URL_TEMPLATE.replace('{slug}', slug);

  try {
    const response = await makeAxiosRequest(METHOD, fullUrl, null);
    logger.info(`Successfully fetched grant details`);
    return toolMessage({
      success: true,
      data: response,
    });
  } catch (error) {
    logger.error(`Error fetching grant details: ${error}`);
    return toolMessage({
      success: false,
      data: `Error occurred while fetching grant details.`,
    });
  }
};

export const earnFetchGrantDetailsTool = createAction({
  name: "earnFetchGrantDetailsTool",
  description: "Fetches the grant details based on the provided slug.",
  inputParams: z.object({
    slug: z.string().describe('Slug identifier of the grant, e.g., "Solana-fdn-coindcx-instagrant"'),
  }),
  execute: earnFetchGrantDetails,
});