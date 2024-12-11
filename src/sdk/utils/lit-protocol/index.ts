import * as LitJsSdk from "@lit-protocol/lit-node-client-nodejs";
import { LocalStorage } from "node-localstorage";
import { decryptToString, encryptString } from "@lit-protocol/encryption";
import { LIT_NETWORK, LIT_ABILITY } from "@lit-protocol/constants";
import { ethers } from "ethers";
import {
  LitAccessControlConditionResource,
  createSiweMessageWithRecaps,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";


class Lit {
  private litNodeClient!: LitJsSdk.LitNodeClientNodeJs;
  private chain: string;
  private ethersWallet: ethers.Wallet | null = null;
  private accessControlConditions: Array<object>;

  constructor(chain: string = "ethereum", privateKey: string | null = null, debug: boolean = false, accessComtrolConditions: Array<object> = []) {
    this.chain = chain;
    this.litNodeClient = new LitJsSdk.LitNodeClientNodeJs({
      litNetwork: LIT_NETWORK.DatilDev,
      debug: debug,
      // This storageProvider object can be omitted if executing in a browser
      storageProvider: {
        provider: new LocalStorage("./lit_storage.db"),
      },
    });
    if (privateKey) {
      this.ethersWallet = new ethers.Wallet(privateKey);
    }

    // Default access control conditions
    this.accessControlConditions = accessComtrolConditions.length > 0 ? accessComtrolConditions : [
      {
        contractAddress: "",
        standardContractType: "",
        chain: chain,
        method: "",
        parameters: [
          ":userAddress",
        ],
        returnValueTest: {
          comparator: "=",
          value: this.ethersWallet?.address || "",
        },
      },
    ];
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
   * Set access control conditions
   */
  setAccessControlConditions(conditions: Array<object>): void {
    this.accessControlConditions = conditions;
  }

  /**
   * Encrypt data
   */
  async encrypt(message: string): Promise<{ ciphertext: string; dataToEncryptHash: string }> {
    if (!this.accessControlConditions) {
      throw new Error("Access Control Conditions are not set");
    }

    // Encrypt the message
    const { ciphertext, dataToEncryptHash } = await encryptString(
      {
        accessControlConditions: this.accessControlConditions,
        dataToEncrypt: message,
      },
      this.litNodeClient,
    );

    // Return the ciphertext and dataToEncryptHash
    return {
      ciphertext,
      dataToEncryptHash,
    };
  }

  /**
     * Decrypt data
     */
  async decrypt(ciphertext: string, dataToEncryptHash: string): Promise<string> {
    if (!this.litNodeClient) {
      throw new Error("LitNodeClient is not connected");
    }

    const sessionSigs = await this.getSessionSignatures();

    const decryptedString = await decryptToString(
      {
        accessControlConditions: this.accessControlConditions,
        chain: this.chain,
        ciphertext,
        dataToEncryptHash,
        sessionSigs: sessionSigs,
      },
      this.litNodeClient,
    );

    return decryptedString;
  }

  /**
   * Obtain session signatures
   */
  private async getSessionSignatures() {
    const latestBlockhash = await this.litNodeClient.getLatestBlockhash();

    const authNeededCallback = async (params: any) => {
      if (!params.uri || !params.expiration || !params.resourceAbilityRequests) {
        throw new Error("Missing required parameters for session signature");
      }

      const toSign = await createSiweMessageWithRecaps({
        uri: params.uri,
        expiration: params.expiration,
        resources: params.resourceAbilityRequests,
        walletAddress: this.ethersWallet?.address || "",
        nonce: latestBlockhash,
        litNodeClient: this.litNodeClient,
      });

      return generateAuthSig({ signer: this.ethersWallet!, toSign });
    };

    const litResource = new LitAccessControlConditionResource("*");

    return this.litNodeClient.getSessionSigs({
      chain: this.chain,
      resourceAbilityRequests: [
        {
          resource: litResource,
          ability: LIT_ABILITY.AccessControlConditionDecryption,
        },
      ],
      authNeededCallback,
    });
  }
}

export { Lit };



