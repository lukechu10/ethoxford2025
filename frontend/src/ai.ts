import { pipeline } from "@huggingface/transformers";

const pipe = await pipeline("text-classification", "Xenova/toxic-bert");

export const classify = async (text: string) => {
	return await pipe(text);
};
