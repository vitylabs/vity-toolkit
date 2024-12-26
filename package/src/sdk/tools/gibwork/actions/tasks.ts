import { createAction } from "../../../helpers/createAction";
import { toolMessage } from "../../../helpers/common";
import { z } from "zod";

import { makeAxiosRequest } from "../common";
import logger from "../../../utils/logger";

const METHOD = 'GET';
const URL_TEMPLATE = '/tasks/{id}';

const gibworkTasks = async (inputParams: { id: string; }): Promise<string> => {

    const fullUrl = URL_TEMPLATE.replace('{id}', inputParams.id);

    try {
        const response = await makeAxiosRequest(METHOD, fullUrl, null);
        logger.info(`Successfully fetched the task from gibwork`);
        return toolMessage({
            success: true,
            data: response,
        });
    } catch (error) {
        logger.error(`Error fetching the task from gibwork: ${error}`);
        return toolMessage({
            success: false,
            data: `Error occurred while fetching the task.`,
        });
    }
};

export const gibworkTasksTool = createAction({
    name: "gibworkTasksTool",
    description: `Fetches Task details using a Task Id from the gibwork platform`,
    inputParams: z.object({
        id: z.string().min(1).optional().describe('Task Id'),
    }),
    execute: gibworkTasks,
});