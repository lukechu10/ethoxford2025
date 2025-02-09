import { createSignal } from "solid-js";
import * as greenfield from "./greenfield";
console.log(greenfield);

const UploadPaper = () => {
	const [paperFile, setPaperFile] = createSignal<File | null>(null);
	const [description, setDescription] = createSignal("");
	const [message, setMessage] = createSignal("");

	const handleFileChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			setPaperFile(target.files[0]);
		}
	};

	const handleSubmit = async () => {
		try {
			if (!paperFile()) throw new Error("No file selected.");
			setMessage("Uploading to Greenfield...");
			// Pass the description as well if needed
			//const fileURL = await uploadToGreenfield(
			//	paperFile()!,
			//	description(),
			//);
			//setMessage(`File uploaded successfully! URL: ${fileURL}`);
		} catch (error: any) {
			console.error("Upload error:", error);
			setMessage(`Error: ${error.message || "Upload failed."}`);
		}
	};

	return (
		<div class="max-w-prose mx-auto mt-5">
			<h1 class="text-4xl font-bold mb-4">Upload Your Research Paper</h1>

			<div class="mb-6">
				<label class="block mb-2 font-semibold">Paper URL</label>
				<input
					placeholder="Enter the URL of the paper"
					class="block w-full p-2 rounded-md mb-4 border-none outline-hidden bg-slate-800 hover:bg-slate-700 focus:bg-slate-900"
				/>

				<label class="block mb-2 font-semibold">
					Add a Description
				</label>
				<textarea
					class="block w-full p-3 rounded-md border-none outline-hidden bg-slate-800 hover:bg-slate-700 focus:bg-slate-900"
					rows="4"
					placeholder="Write a description..."
					value={description()}
					onInput={(e) => setDescription(e.currentTarget.value)}
				></textarea>

				<button
					class="btn bg-orange-600 hover:bg-orange-700 rounded-full mt-4 w-full"
					onClick={handleSubmit}
				>
					Upload Paper
				</button>
			</div>

			{message() && (
				<p class="mt-4 text-center text-gray-400">{message()}</p>
			)}
		</div>
	);
};

export default UploadPaper;
