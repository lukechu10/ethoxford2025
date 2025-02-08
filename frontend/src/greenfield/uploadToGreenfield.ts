// uploadToGreenfield.ts

import { client } from "./greenfieldClient";

// Retrieve the account's private key from environment variables.
//const ACCOUNT_PRIVATEKEY = process.env.ACCOUNT_PRIVATEKEY as string;

/**
 * Uploads a File (from a file input) to a specified bucket in Greenfield storage.
 *
 * @param file - The File object selected from an input element.
 * @returns The public URL for the uploaded file.
 */
export async function uploadToGreenfield(file: File): Promise<string> {
	// Define your bucket name and derive the object name from the file.
	const bucketName = "research-papers";
	const objectName = file.name;

	// Optionally, you can include a transaction hash if needed; otherwise, use an empty string.
	const txnHash = "";

	try {
		// Upload the file using the client's upload method.
		const uploadRes = await client.object.uploadObject(
			{
				bucketName,
				objectName,
				body: file, // In the browser, the File object is already a Blob.
				txnHash,
			},
			{
				type: "ECDSA",
				privateKey: ACCOUNT_PRIVATEKEY,
			},
		);

		// Log the full response to help debug the returned data structure.
		console.log("Upload Response:", uploadRes);

		// Since the SDK does not return a "success" property,
		// we assume that if no error is thrown, the upload succeeded.
		const fileURL = `https://${bucketName}.gnfd.storage/${objectName}`;
		return fileURL;
	} catch (error) {
		console.error("Error uploading to Greenfield:", error);
		throw error;
	}
}
