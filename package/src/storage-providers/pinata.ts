import { PinataSDK } from "pinata";
import logger from "../sdk/utils/logger";


export class PinataStorageProvider {
    private readonly pinataJwt: string;
    private readonly pinataGateway: string;
    private readonly pinata: PinataSDK;

    constructor() {
        this.pinataJwt = process.env.PINATA_JWT as string;
        this.pinataGateway = process.env.PINATA_GATEWAY as string;
        if (!this.pinataJwt || !this.pinataGateway) {
            throw new Error('Pinata JWT and Gateway are required in environment variables');
        }

        this.pinata = new PinataSDK({
            pinataJwt: this.pinataJwt,
            pinataGateway: this.pinataGateway,
        });
    }

    public async store(json: object): Promise<string | undefined> {
        try {
            const upload = await this.pinata.upload.json(json);
            logger.debug(`Successfully stored data on Pinata with CID: ${upload.cid}`);
            return upload.cid;
        } catch (error) {
            logger.error(`Error storing data on Pinata: ${error}`);
            throw error;
        }
    }

    public async retrieve(cid: string): Promise<object | undefined> {
        try {
            const url = await this.pinata.gateways.createSignedURL({
                cid: cid,
                expires: 1800,
            });
            const json = await this.fetchJSON(url);

            logger.debug(`Successfully retrieved data from Pinata with CID: ${cid}`);
            return json;
        } catch (error) {
            logger.error(`Error retrieving data from Pinata with CID: ${cid}: ${error}`);
            throw error;
        }
    }

    private async fetchJSON(url: string): Promise<object> {
        try {
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            logger.error(`Error fetching JSON from URL: ${url}: ${error}`);
            throw error;
        }
    }

}

