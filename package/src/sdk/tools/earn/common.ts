import axios, { type AxiosResponse, AxiosError } from 'axios';


// Common axios query function
const axiosInstance = axios.create({
    baseURL: 'https://earn.superteam.fun/api',
    timeout: 3000,
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
                throw err.response.data;
            } else if (err.request) {
                // Client never received a response, or request never left
                throw err.request;
            } else {
                // Something happened in setting up the request that triggered an Error
                throw new Error(`Error: ${err.message}`);
            }
        });
}