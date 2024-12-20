import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Contract } from "../target/types/contract";


describe("contract", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.Contract as Program<Contract>;

  // App Auth

  it("Save app auth", async () => {
    const ix = program.methods.saveAppAuth("X", "app_ipfs_uri");
    const pdaAddress = (await ix.pubkeys()).appAuth;
    console.log("PDA address :: ", pdaAddress.toString());

    const tx = await ix.rpc()
    console.log("Your transaction signature", tx);

    let authDetails = await program.account.appAuth.fetch(pdaAddress);
    console.log("Auth details", JSON.stringify(authDetails, null, 2));
  });

  it("Get already saved app auth", async () => {
    const appAddress = new anchor.web3.PublicKey("CFkpmQ1mWkxDapUiNUA3uwNG2zjwkTGUEf1Cwh58YZj6");
    const [pdaAddress, _] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode('app-auth'),
        appAddress.toBuffer(),
      ],
      program.programId
    )
    try {
      let authDetails = await program.account.appAuth.fetch(pdaAddress);
      console.log("Auth details", JSON.stringify(authDetails, null, 2));
    } catch (error) {
      console.log("Error fetching the auth :: ", error);
    }
  });

  // User Auth

  it("Save user auth", async () => {
    const appAddress = new anchor.web3.PublicKey("CFkpmQ1mWkxDapUiNUA3uwNG2zjwkTGUEf1Cwh58YZj6");

    const ix = program.methods.saveUserAuth(appAddress, "X", "user_ipfs_uri");
    const pdaAddress = (await ix.pubkeys()).userAuth;
    console.log("PDA address :: ", pdaAddress.toString());

    const tx = await ix.rpc()
    console.log("Your transaction signature", tx);

    let authDetails = await program.account.userAuth.fetch(pdaAddress);
    console.log("Auth details", JSON.stringify(authDetails, null, 2));
  });

  it("Get already saved user auth", async () => {
    const userAddress = new anchor.web3.PublicKey("CFkpmQ1mWkxDapUiNUA3uwNG2zjwkTGUEf1Cwh58YZj6");

    const [pdaAddress, _] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode('user-auth'),
        userAddress.toBuffer(),
      ],
      program.programId
    )
    try {
      let authDetails = await program.account.userAuth.fetch(pdaAddress);
      console.log("Auth details", JSON.stringify(authDetails, null, 2));
    } catch (error) {
      console.log("Error fetching the auth :: ", error);
    }
  });

});
