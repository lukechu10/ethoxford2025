import { client } from "./greenfieldClient";

// ⚠️ SECURITY WARNING:
// Do not expose your private key in client-side code in production!
// Instead, move this logic to a secure backend service.
// For demonstration, we use an environment variable via Vite.
const ACCOUNT_PRIVATEKEY = import.meta.env.VITE_ACCOUNT_PRIVATEKEY;
if (!ACCOUNT_PRIVATEKEY) {
	throw new Error(
		"ACCOUNT_PRIVATEKEY is not defined in the environment variables."
	);
}

/**
 * Uploads a file to a specified bucket in Greenfield storage.
 *
 * @param file - The File object to be uploaded.
 * @param description - Optional description or metadata for the file.
 * @returns The public URL for the uploaded file.
 */
export async function uploadToGreenfield(
	file: File,
	description?: string
): Promise<string> {
	const bucketName = "research-papers";
	const objectName = file.name;
	const txnHash = ""; // Include a transaction hash if required by the API

	try {
		// If you need to include the description as metadata, check if the SDK supports it.
		// For now, we only upload the file.
		const uploadRes = await client.object.uploadObject(
			{
				bucketName,
				objectName,
				body: file, // File is already a Blob in the browser.
				txnHash,
			},
			{
				type: "ECDSA",
				privateKey: ACCOUNT_PRIVATEKEY,
			}
		);

		console.log("Upload Response:", uploadRes);

		// Construct the URL from which the file can be accessed.
		const fileURL = `https://${bucketName}.gnfd.storage/${objectName}`;
		return fileURL;
	} catch (error) {
		console.error("Error uploading to Greenfield:", error);
		throw error;
	}
}
