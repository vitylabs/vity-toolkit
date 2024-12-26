import axios, { type AxiosResponse, AxiosError } from 'axios';
import logger from '../../utils/logger';


// Common axios query function
const axiosInstance = axios.create({
    baseURL: 'https://api2.gib.work',
    timeout: 7000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export async function makeAxiosRequest(method: string, urlPath: string, data: any) {
    /* Auxiliar function to make different axios requests to my endpoint */

    return axiosInstance({
        method,
        url: urlPath,
        data,
    })
        .then((res: AxiosResponse) => res.data)
        .catch((err: AxiosError) => {
            if (err.response) {
                /* 
                  The request was made and the server responded with a status code
                  that falls out of the range of 2xx
                */
               logger.error(`Error making request to ${urlPath} :: ${err.response.data}`);
                throw err.response.data;
            } else if (err.request) {
                // Client never received a response, or request never left
                logger.error(`Error making request to ${urlPath} :: ${err.request}`);
                throw err.request;
            } else {
                // Something happened in setting up the request that triggered an Error
                logger.error(`Error making request to ${urlPath} :: ${err.message}`);
                throw new Error(`${err.message}`);
            }
        });
}