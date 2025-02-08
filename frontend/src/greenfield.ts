import { Client, VisibilityType } from "@bnb-chain/greenfield-js-sdk";
import * as provider from "./provider";
import Long from "long";

// Create a Greenfield client instance
export const client = Client.create(
	"https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org", // Greenfield Testnet RPC endpoint
	"97", // Testnet chain ID
);

export const getSps = async () => {
	const sps = await client.sp.getStorageProviders();
	const finalSps = (sps ?? []).filter((v: any) =>
		v.endpoint.includes("nodereal"),
	);

	return finalSps;
};

export const getAllSps = async () => {
	const sps = await getSps();

	return sps.map((sp) => {
		return {
			address: sp.operatorAddress,
			endpoint: sp.endpoint,
			name: sp.description?.moniker,
		};
	});
};

export const selectSp = async () => {
	const finalSps = await getSps();

	const selectIndex = Math.floor(Math.random() * finalSps.length);

	const secondarySpAddresses = [
		...finalSps.slice(0, selectIndex),
		...finalSps.slice(selectIndex + 1),
	].map((item) => item.operatorAddress);
	const selectSpInfo = {
		id: finalSps[selectIndex].id,
		endpoint: finalSps[selectIndex].endpoint,
		primarySpAddress: finalSps[selectIndex]?.operatorAddress,
		sealAddress: finalSps[selectIndex].sealAddress,
		secondarySpAddresses,
	};

	return selectSpInfo;
};

export const createObject = async () => {
	const sp = await selectSp();

	const signer = provider.signer!;
	const address = await signer.getAddress();

	const offchainAuthRes =
		await client.offchainauth.genOffChainAuthKeyPairAndUpload(
			{
				sps: [
					{
						address: sp.primarySpAddress,
						endpoint: sp.endpoint,
					},
				],
				chainId: 5600,
				expirationMs: 5 * 24 * 60 * 60 * 1000,
				domain: window.location.origin,
				// your wallet account
				address,
			},
			window.ethereum,
		);

	const createBucketTx = await client.bucket.createBucket({
		bucketName: "bucket-test",
		creator: address,
		visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
		chargedReadQuota: Long.fromString("0"),
		primarySpAddress: sp.primarySpAddress,
		paymentAddress: address,
	});
	const simulateInfo = await createBucketTx.simulate({
		denom: "BNB",
	});

	const res = await createBucketTx.broadcast({
		denom: "BNB",
		gasLimit: Number(simulateInfo?.gasLimit),
		gasPrice: simulateInfo?.gasPrice || "5000000000",
		payer: address,
		granter: "",
		signTypedDataCallback: async (addr, msg) => {
			return provider.provider!.send("eth_signTypedData_v4", [addr, msg]);
		},
	});

	if (res.code !== 0) {
		throw new Error("Create bucket failed");
	} else {
		console.log(res);
	}
};
