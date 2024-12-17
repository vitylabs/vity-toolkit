import { config } from "dotenv";

const result = config();

if (result.error) {
    throw result.error;
}

export const privateKey: string = process.env.ETH_ACCOUNT_PRIVATE_KEY!;