import { Contract, ethers, JsonRpcSigner } from "ethers";

import CONTRACT_ABI from "../../contracts/abi.json";
import { address as CONTRACT_ADDRESS } from "../../contracts/address.json";

import { createContext, useContext } from "solid-js";

console.log(`Contract address: ${CONTRACT_ADDRESS}`);

export const provider = new ethers.BrowserProvider(window.ethereum);
export let signer: JsonRpcSigner | null = null;
export let contract: Contract | null = null;

/**
	* Return signer from MetaMask.
	* */
export async function getSigner() {
	await provider.send("eth_requestAccounts", []);

	signer = await provider.getSigner();
	contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

	return signer;
}

export const SignerContext = createContext<JsonRpcSigner>();

export async function getPapers() {
	return await contract!.getAllPapers();
}

export async function submitPaper(title: string): Promise<number> {
	const tx = await contract!.submitPaper(title);
	await tx.wait();

	return tx;
}


