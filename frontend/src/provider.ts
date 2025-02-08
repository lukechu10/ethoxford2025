import { ethers, JsonRpcSigner } from "ethers";
import ABI from "../../contracts/abi.json";

import { address } from "../../contracts/address.json";
import { createContext } from "solid-js";

export const provider = new ethers.BrowserProvider(window.ethereum);

/**
	* Return signer from MetaMask.
	* */
export async function getSigner() {
	await provider.send("eth_requestAccounts", []);
	return await provider.getSigner();
}

export const SignerContext = createContext<JsonRpcSigner>();
