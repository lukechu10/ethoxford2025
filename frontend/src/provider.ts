import { Contract, ethers, JsonRpcSigner } from "ethers";

import CONTRACT_ABI from "../../contracts/abi.json";
import { address as CONTRACT_ADDRESS } from "../../contracts/address.json";

import { createContext } from "solid-js";

console.log(`Contract address: ${CONTRACT_ADDRESS}`);

export const provider = window.ethereum
	? new ethers.BrowserProvider(window.ethereum)
	: null;
export let signer: JsonRpcSigner | null = null;
export let contract: Contract | null = null;

/**
 * Return signer from MetaMask.
 * */
export async function getSigner() {
	await provider!.send("eth_requestAccounts", []);

	signer = await provider!.getSigner();
	contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

	return signer;
}

export const SignerContext = createContext<JsonRpcSigner>();

// Paper data.
export interface Paper {
	id: number;
	author: string;
	title: string;
	timestamp: Date;
	votes: number;
	reviews: any[];
}

export interface Review {
	comment: string;
	votes: number;
}

function mapPaperFields(paper: any[]): Paper {
	const [id, author, title, timestamp_unix, votes, reviews] = paper;
	// Convert timestamp from unix to JS date.
	const timestamp = new Date(Number(timestamp_unix) * 1000);

	return { id, author, title, timestamp, votes: Number(votes), reviews };
}

function mapReviewFields(review: any[]): Review {
	const [_a, _b, _c, comment, votes] = review;
	return { comment, votes: Number(votes) };
}

export async function getAllPapers(): Promise<Paper[]> {
	return (await contract!.getAllPapers()).map(mapPaperFields);
}

export async function getPaper(paperId: number): Promise<Paper> {
	return mapPaperFields(await contract!.papers(paperId));
}

export async function getReview(reviewId: number): Promise<Review> {
	return mapReviewFields(await contract!.reviews(reviewId));
}

export async function submitPaper(title: string) {
	const tx = await contract!.submitPaper(title);
	await tx.wait();

	return tx;
}

export async function votePaper(paperId: number, upvote: boolean) {
	const tx = await contract!.votePaper(paperId, upvote);
	await tx.wait();

	return tx;
}

export async function submitReview(paperId: number, review: string) {
	const tx = await contract!.submitReview(paperId, review);
	await tx.wait();

	return tx;
}

export async function voteReview(reviewId: number, upvote: boolean) {
	const tx = await contract!.voteReview(reviewId, upvote);
	await tx.wait();

	return tx;
}

export async function getPaperVotes(paperId: number) {
	return await contract!.getPaperVotes(paperId);
}

export async function getReviewVotes(reviewId: number) {
	return await contract!.getReviewVotes(reviewId);
}

export async function getReputation(address: string) {
	return await contract!.getReputation(address);
}

export async function getPaperReviews(paperId: number) {
	return await contract!.getPaperReviews(paperId);
}
