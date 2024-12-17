import { createAction } from "../../../helpers/createAction";
import { toolMessage } from "../../../helpers/common";
import { z } from "zod";

import { makeAxiosRequest } from "../common";

const METHOD = 'GET';
const URL_TEMPLATE = '/earn/grants/{slug}';

const earnFetchGrantDetails = async (inputParams: { slug: string; }): Promise<string> => {
  const { slug } = inputParams;
  const fullUrl = URL_TEMPLATE.replace('{slug}', slug);

  try {
    const response = await makeAxiosRequest(METHOD, fullUrl, null);
    console.log(response);
    return toolMessage({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error(`Error fetching grant details:`, error);
    return toolMessage({
      success: false,
      data: `Error occurred while fetching grant details.`,
    });
  }
};

export const earnFetchGrantDetailsTool = createAction({
  name: "earnFetchGrantDetailsTool",
  description: "Fetches grant details based on the provided slug.",
  inputParams: z.object({
    slug: z.string().describe('Slug identifier of the grant, e.g., "Solana-fdn-coindcx-instagran"'),
  }),
  execute: earnFetchGrantDetails,
});