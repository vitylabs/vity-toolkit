import { Lit } from "../src";
import { privateKey } from "./config/config";


const chain = "ethereum";
const message = "Hello, World!";
// const randomPrivateKey = '765c41cf43b00f4858f82d83028fa2aefea4f722714463c94d2ee881ccd8cc93';

// Encrypt a message
console.log('Encrypting message...');
let myLit = new Lit(
    chain,
    privateKey
);
await myLit.connect();
const { ciphertext, dataToEncryptHash } = await myLit.encrypt(message);
await myLit.disconnect();

// Decrypt the message
console.log('Decrypting message...');
let myLit2 = new Lit(
    chain,
    // randomPrivateKey
    privateKey
);
await myLit2.connect();
const decryptedMessage = await myLit2.decrypt(ciphertext, dataToEncryptHash);
console.log('decryptedMessage:', decryptedMessage);
await myLit2.disconnect();


