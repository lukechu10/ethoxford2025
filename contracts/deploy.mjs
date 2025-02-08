import { Contract, ContractFactory, ethers } from 'ethers';
import { readFileSync, writeFileSync } from "fs";
import solc from "solc";

const source = readFileSync("./Test.sol").toString();

const input = {
	language: "Solidity",
	sources: {
		"Test.sol": {
			content: source
		}
	},
	settings: {
		outputSelection: {
			"*": {
				"*": ["*"]
			}
		}
	}
}

console.log("Compiling contract...");
const bin = JSON.parse(solc.compile(JSON.stringify(input)));
console.log("Finished compiling.");

const ABI = bin.contracts["Test.sol"]["Test"].abi;
const bytecode = bin.contracts["Test.sol"]["Test"].evm.bytecode.object;

console.log("Deploying to network...");

const key = readFileSync("./.key").toString().trim();

const provider = new ethers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");
const signer = new ethers.Wallet(key, provider);

const factory = new ContractFactory(ABI, bytecode, signer);
const contract = await factory.deploy();
console.log(contract);

writeFileSync("./abi.json", JSON.stringify(ABI));
