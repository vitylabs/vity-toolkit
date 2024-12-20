import type { Keypair } from "@solana/web3.js";
import type { SiwsObject } from "../utils/lit-protocol/types";
import { base58 } from "ethers/src.ts/utils";
import nacl from "tweetnacl";

export const getSiwsMessage = (siwsInput: SiwsObject['siwsInput']) => {
    console.log('🔄 Generating SIWS message...');
    let message = `${siwsInput.domain} wants you to sign in with your Solana account:\n${siwsInput.address}`;

    if (siwsInput.statement) {
        message += `\n\n${siwsInput.statement}`;
    }

    const fields = [];

    if (siwsInput.uri !== undefined) fields.push(`URI: ${siwsInput.uri}`);
    if (siwsInput.version !== undefined)
        fields.push(`Version: ${siwsInput.version}`);
    if (siwsInput.chainId !== undefined)
        fields.push(`Chain ID: ${siwsInput.chainId}`);
    if (siwsInput.nonce !== undefined) fields.push(`Nonce: ${siwsInput.nonce}`);
    if (siwsInput.issuedAt !== undefined)
        fields.push(`Issued At: ${siwsInput.issuedAt}`);
    if (siwsInput.expirationTime !== undefined)
        fields.push(`Expiration Time: ${siwsInput.expirationTime}`);
    if (siwsInput.notBefore !== undefined)
        fields.push(`Not Before: ${siwsInput.notBefore}`);
    if (siwsInput.requestId !== undefined)
        fields.push(`Request ID: ${siwsInput.requestId}`);
    if (siwsInput.resources !== undefined && siwsInput.resources.length > 0) {
        fields.push('Resources:');
        for (const resource of siwsInput.resources) {
            fields.push(`- ${resource}`);
        }
    }

    if (fields.length > 0) {
        message += `\n\n${fields.join('\n')}`;
    }

    console.log(`✅ Generated SIWS message:\n${message}`);
    return message;
};

export const signSiwsMessage = (
    messageBytes: Uint8Array,
    solanaSigner: Keypair
) => {
    console.log('🔄 Signing SIWS message...');
    const signature = base58.encode(
        nacl.sign.detached(messageBytes, solanaSigner.secretKey)
    );
    console.log(`✅ Signed SIWS message: ${signature}`);
    return signature;
};