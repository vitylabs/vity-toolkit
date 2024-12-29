import crypto from 'crypto';
import bs58 from 'bs58';


function deriveKeyFromSolanaPrivateKey(privateKeyBase58: string): Buffer {
    const privateKeyBytes = bs58.decode(privateKeyBase58);
    // Hash the 32-byte key to get a 256-bit (32-byte) AES key
    return crypto.createHash('sha256').update(privateKeyBytes).digest();
}

export function encryptData(data: string, privateKeyBase58: string): { iv: string; authTag: string; ciphertext: string } {
    const key = deriveKeyFromSolanaPrivateKey(privateKeyBase58);
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
    return {
        iv: iv.toString('hex'),
        authTag: cipher.getAuthTag().toString('hex'),
        ciphertext: encrypted.toString('hex')
    };
}

export function decryptData(payload: { iv: string; authTag: string; ciphertext: string }, privateKeyBase58: string): string {
    const key = deriveKeyFromSolanaPrivateKey(privateKeyBase58);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(payload.iv, 'hex'));
    decipher.setAuthTag(Buffer.from(payload.authTag, 'hex'));
    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(payload.ciphertext, 'hex')),
        decipher.final()
    ]);
    return decrypted.toString('utf8');
}

// Usage:
// const solanaPrivatekey = process.env.DEMO_SOLANA_PRIVATE_KEY;
// const result = encryptData("Sensitive data", solanaPrivatekey);
// console.log("Encrypted=", result);
// console.log("Decrypted=", decryptData(result, solanaPrivatekey));