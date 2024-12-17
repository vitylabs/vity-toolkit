import { createAction } from "../../../helpers/createAction";
import { toolMessage } from "../../../helpers/common";
import { z } from "zod";

import { makeAxiosRequest } from "../common";

const METHOD = 'GET';
const URL_TEMPLATE = '/earn/submission/details?submissionId={submissionId}';

const earnSubmissionDetails = async (inputParams: { submissionId: string; }): Promise<string> => {
  const { submissionId } = inputParams;
  const fullUrl = URL_TEMPLATE.replace('{submissionId}', submissionId);

  try {
    const response = await makeAxiosRequest(METHOD, fullUrl, null);
    console.log(response);
    return toolMessage({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error(`Error fetching submission details:`, error);
    return toolMessage({
      success: false,
      data: `Error occurred while fetching submission details.`,
    });
  }
};

export const earnSubmissionDetailsTool = createAction({
  name: "earnSubmissionDetailsTool",
  description: "Fetches details of a specific submission based on the provided submission ID from the Superteam Earn homepage.",
  inputParams: z.object({
    submissionId: z.string().describe('ID of the submission to fetch details for'),
  }),
  execute: earnSubmissionDetails,
});