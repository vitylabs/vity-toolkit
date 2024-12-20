import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
    pinataJwt: process.env.PUBLIC_PINATA_JWT,
    pinataGateway: process.env.PUBLIC_PINATA_GATEWAY,
});


export async function uploadJsonPinata(json: object) {
    try {
        const upload = await pinata.upload.json(json);
        console.log(upload);
        return upload.cid;

    } catch (error) {
        console.log(error);
    }
}

export async function retrieveJsonPinata(cid: string) {
    try {
        const data = await pinata.gateways.get(cid);
        console.log(data)

        const url = await pinata.gateways.createSignedURL({
            cid: cid,
            expires: 1800,
        })
        console.log(url);
        return url;

    } catch (error) {
        console.log(error);
    }
}