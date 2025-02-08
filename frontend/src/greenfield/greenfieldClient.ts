import { Client } from "@bnb-chain/greenfield-js-sdk";

// Create a Greenfield client instance
export const client = Client.create(
  "https://gnfd-testnet-fullnode-tendermint-ap.bnbchain.org", // Greenfield Testnet RPC endpoint
  "5600", // Testnet chain ID
  
);

console.log(client)