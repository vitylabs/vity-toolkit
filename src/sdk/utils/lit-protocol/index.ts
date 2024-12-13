import * as LitJsSdk from "@lit-protocol/lit-node-client-nodejs";
import { LocalStorage } from "node-localstorage";
import { decryptToString, encryptString } from "@lit-protocol/encryption";
import { LIT_NETWORK, LIT_ABILITY, LIT_RPC } from "@lit-protocol/constants";
import {
  LitAccessControlConditionResource,
  createSiweMessageWithRecaps,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";
import { getKeypair } from "../../helpers/getPublicKey";
import { Keypair, PublicKey } from "@solana/web3.js";


function conditionsToDecrypt(publicKey: PublicKey) {
  return [
    {
      method: '',
      params: [':userAddress'],
      pdaParams: [],
      pdaInterface: { offset: 0, fields: {} },
      pdaKey: '',
      chain: 'solana',
      returnValueTest: {
        key: '',
        comparator: '=',
        value: publicKey.toBase58(),
      },
    }
  ];
}

class Lit {
  private privateKey: string;
  private litNodeClient!: LitJsSdk.LitNodeClientNodeJs;
  private solanaWallet: Keypair;

  constructor(privateKey: string, debug: boolean = false, accessComtrolConditions: Array<object> = []) {
    this.privateKey = privateKey;
    this.litNodeClient = new LitJsSdk.LitNodeClientNodeJs({
      litNetwork: LIT_NETWORK.DatilDev,
      // debug: debug,
    });
    if (privateKey) {
      this.solanaWallet = getKeypair(privateKey);
    } else {
      throw new Error("Private key is required");
    }
  }

  /**
   * Connect to the Lit network
   */
  async connect() {
    await this.litNodeClient.connect();
  }

  /**
   * Disconnect from the Lit network
   */
  async disconnect() {
    await this.litNodeClient.disconnect();
  }

  /**
   * Encrypt data
   */
  async encrypt(message: string): Promise<{ dataToEncryptHash: string, ciphertext: string }> {
    try {
      const solRpcConditions = conditionsToDecrypt(this.solanaWallet.publicKey);

      // Encrypt the message
      const { ciphertext, dataToEncryptHash } = await this.litNodeClient.encrypt(
        {
          dataToEncrypt: new TextEncoder().encode(message),
          solRpcConditions: solRpcConditions,
        }
      );
      console.log("✅ Encrypted data");
      // Return the ciphertext and dataToEncryptHash
      return {
        dataToEncryptHash,
        ciphertext,
      };
    } catch (error) {
      console.error("❌ Error encrypting data", error);
      throw error;
    }
  }

  /**
     * Decrypt data
     */
  async decrypt(ciphertext: string, dataToEncryptHash: string): Promise<string> {
    try {
      const solRpcConditions = conditionsToDecrypt(this.solanaWallet.publicKey);
      // const sessionSigs = await this.getSessionSignatures();

      const decryptedString = await decryptToString(
        {
          solRpcConditions: solRpcConditions,
          chain: "solana",
          ciphertext,
          dataToEncryptHash,
          // sessionSigs: sessionSigs,
        },
        this.litNodeClient,
      );

      return decryptedString;
    } catch (error) {
      console.error("❌ Error decrypting data", error);
      throw error;
    }
  }

  /**
   * Obtain session signatures
   */
  // private async getSessionSignatures() {
  //   const latestBlockhash = await this.litNodeClient.getLatestBlockhash();

  //   const authNeededCallback = async (params: any) => {
  //     if (!params.uri || !params.expiration || !params.resourceAbilityRequests) {
  //       throw new Error("Missing required parameters for session signature");
  //     }

  //     const toSign = await createSiweMessageWithRecaps({
  //       uri: params.uri,
  //       expiration: params.expiration,
  //       resources: params.resourceAbilityRequests,
  //       walletAddress: this.solanaWallet.publicKey.toString(),
  //       nonce: latestBlockhash,
  //       litNodeClient: this.litNodeClient,
  //     });

  //     return generateAuthSig({ signer: this.solanaWallet, toSign });
  //   };


  //   const litResource = new LitAccessControlConditionResource("*");

  //   return this.litNodeClient.getSessionSigs({
  //     chain: "solana",
  //     resourceAbilityRequests: [
  //       {
  //         resource: litResource,
  //         ability: LIT_ABILITY.AccessControlConditionDecryption,
  //       },
  //     ],
  //     authNeededCallback: authNeededCallback,
  //   });
  // }
}

export { Lit };



