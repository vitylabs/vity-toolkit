import { createAction } from "../../../helpers/createAction";
import { toolMessage } from "../../../helpers/common";
import { z } from "zod";

import { makeAxiosRequest } from "../common";

const METHOD = 'GET';
const URL_TEMPLATE = '/earn/feed/{type}/{id}/get';


const earnFetchFeedItem = async (inputParams: { type: string; id: string; }): Promise<string> => {
  const { type, id } = inputParams;
  const fullUrl = URL_TEMPLATE.replace('{type}', type).replace('{id}', id);

  try {
    const response = await makeAxiosRequest(METHOD, fullUrl, null);
    console.log(response);
    return toolMessage({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error(`Error fetching feed item:`, error);
    return toolMessage({
      success: false,
      data: `Error occurred while fetching feed item.`,
    });
  }
};

export const earnFetchFeedItemTool = createAction({
  name: "earnFetchFeedItemTool",
  description: "Fetches a specific feed item by type and ID from the superteam earn platform",
  inputParams: z.object({
    type: z.string().describe('Type of the feed post (e.g., "post", "comment")'),
    id: z.string().uuid().describe('UUID of the feed post'),
  }),
  execute: earnFetchFeedItem,
});