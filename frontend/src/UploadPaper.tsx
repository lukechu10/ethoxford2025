import { createSignal } from "solid-js";
import { uploadToGreenfield } from "./greenfield/uploadToGreenfield";

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
			const fileURL = await uploadToGreenfield(
				paperFile()!,
				description(),
			);
			setMessage(`File uploaded successfully! URL: ${fileURL}`);
		} catch (error: any) {
			console.error("Upload error:", error);
			setMessage(`Error: ${error.message || "Upload failed."}`);
		}
	};

	return (
		<div class="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
			<h1 class="text-2xl font-bold mb-4">Upload Your Research Paper</h1>

			<div class="mb-6">
				<label class="block mb-2 font-semibold">Select PDF File</label>
				<input
					type="file"
					accept=".pdf"
					class="block w-full p-2 border rounded-md mb-4"
					onChange={handleFileChange}
				/>

				<label class="block mb-2 font-semibold">
					Add a Description
				</label>
				<textarea
					class="block w-full p-3 border rounded-md"
					rows="4"
					placeholder="Write a description..."
					value={description()}
					onInput={(e) => setDescription(e.currentTarget.value)}
				></textarea>

				<button
					class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
					onClick={handleSubmit}
				>
					Upload Paper
				</button>
			</div>

			{message() && (
				<p class="mt-4 text-center text-gray-700">{message()}</p>
			)}
		</div>
	);
};

export default UploadPaper;
