import { Client } from "@bnb-chain/greenfield-js-sdk";

// Create a Greenfield client instance
export const client = Client.create(
	"https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org", // Greenfield Testnet RPC endpoint
	"greenfield_5600-1" // Testnet chain ID
);

console.log(client);
