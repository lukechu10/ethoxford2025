import { createSignal } from "solid-js";
import * as provider from "./provider";
import { classify } from "./ai";

const UploadPaper = () => {
	const [title, setTitle] = createSignal("");
	const [uri, setUri] = createSignal("");
	const [description, setDescription] = createSignal("");

	const [disabled, setDisabled] = createSignal(false);
	const [message, setMessage] = createSignal("");

	const handleSubmit = async () => {
		const titleTrimmed = title().trim();
		const uriTrimmed = uri().trim();
		const descriptionTrimmed = description().trim();
		if (uriTrimmed === "" || descriptionTrimmed === "") {
			setMessage("Please fill out all fields.");
			return;
		}

		const result = await classify(descriptionTrimmed);
		const toxicScore = (result[0] as any).score;
		console.log(toxicScore);
		if (toxicScore > 0.5) {
			setMessage("Hateful content is against our guidelines.");
			setDisabled(false);
			return;
		}

		setMessage("Uploading...");
		setDisabled(true);

		// TODO: calculate hash of the file.
		await provider.submitPaper(
			titleTrimmed,
			uriTrimmed,
			"0",
			descriptionTrimmed,
		);

		setMessage("Paper uploaded successfully.");
		setDisabled(false);

		setTitle("");
		setUri("");
		setDescription("");
	};

	return (
		<div class="max-w-prose mx-auto mt-5">
			<h1 class="text-4xl font-bold mb-4">Upload Your Research Paper</h1>

			<div class="mb-6">
				<label class="block mb-2 font-semibold">Paper Title</label>
				<input
					placeholder="Enter the title of the paper"
					class="block w-full p-2 rounded-md mb-4 border-none outline-hidden bg-slate-800 hover:bg-slate-700 focus:bg-slate-900"
					value={title()}
					onInput={(e) => setTitle(e.currentTarget.value)}
				/>

				<label class="block mb-2 font-semibold">Paper URL</label>
				<input
					placeholder="Enter the URL of the paper"
					class="block w-full p-2 rounded-md mb-4 border-none outline-hidden bg-slate-800 hover:bg-slate-700 focus:bg-slate-900"
					value={uri()}
					onInput={(e) => setUri(e.currentTarget.value)}
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
					disabled={disabled()}
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
