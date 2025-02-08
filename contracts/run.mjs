// Utility script to compile and deploy the contract to the BSC Testnet.

import { ContractFactory, ethers } from 'ethers';
import { readFileSync, writeFileSync } from "fs";
import solc from "solc";

function compile_solc() {
	const source = readFileSync("./DeSci.sol").toString();

	const input = {
		language: "Solidity",
		sources: {
			"DeSci.sol": {
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

	const contract = bin.contracts["DeSci.sol"]["DeSci"];
	const ABI = contract.abi;
	const bytecode = contract.evm.bytecode.object;
	return { ABI, bytecode };
}

const { ABI, bytecode } = compile_solc();
writeFileSync("./abi.json", JSON.stringify(ABI));

const deploy = process.argv.find(arg => arg === "--deploy");

if (deploy) {
	console.log("Deploying to network...");

	const key = readFileSync("./.key").toString().trim();

	const provider = new ethers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");
	const signer = new ethers.Wallet(key, provider);

	const factory = new ContractFactory(ABI, bytecode, signer);
	const contract = await factory.deploy();


	const address = await contract.getAddress();
	writeFileSync("./address.json", JSON.stringify({ address }));
	console.log("Contract successfully deployed. Address: " + address)
} else {
	console.log("Contract was not deployed. Pass the --deploy flag to deploy the contract.");
}
