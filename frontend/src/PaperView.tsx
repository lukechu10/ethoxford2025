import { Component, createResource, createSignal, Show } from "solid-js";
import { A, useParams } from "@solidjs/router";
import * as provider from "./provider";
//import "./PostView.css";

const EXAMPLE_PDF = "https://example.com/another-pdf.pdf";
const posts = [
	{
		id: 0,
		title: "Hello, world!",
		author: "Alice",
		date: "2/1/1990",
		content: "This is a test post.",
		pdf: "https://introcs.cs.princeton.edu/java/home/chapter1.pdf",
	},
	{
		id: 1,
		title: "Boop",
		author: "Bob",
		date: "2/2/1990",
		content: "This is another test post.",
		pdf: "https://example.com/another-pdf.pdf",
	},
];

const PostView: Component = () => {
	const params = useParams();
	const paperId = params.id;

	const [paper, {}] = createResource(() => provider.getPaper(+paperId));

	// TODO: use the url from the paper data in contract.
	return (
		<Show when={paper()}>
			<div class="max-w-prose mx-auto pt-5">
				<h1 class="font-bold text-4xl">{paper()!.title}</h1>
				<p class="text-gray-400">
					By{" "}
					<A
						href={`/profile/${paper()!.author}`}
						class="font-mono font-bold text-orange-200"
					>
						{paper()!.author}
					</A>{" "}
					on {paper()!.timestamp.toDateString()}
				</p>

				<iframe
					title="pdf"
					src={EXAMPLE_PDF}
					height="500"
					width="100%"
					class="mt-10"
				></iframe>

				<div class="reviews"></div>
			</div>
		</Show>
	);
	//const [reviews, setReviews] = createSignal<
	//	{ text: string; votes: number }[]
	//>([]);
	//const [newReview, setNewReview] = createSignal<string>("");
	//const [postVotes, setPostVotes] = createSignal(0);
	//
	//const post = posts.find((p) => p.id === Number(params.id));
	//
	//const handlePostUpvote = () => setPostVotes(postVotes() + 1);
	//const handlePostDownvote = () => setPostVotes(postVotes() - 1);
	//
	//const submitReview = () => {
	//	if (newReview().trim() === "") {
	//		alert("Review cannot be empty!");
	//		return;
	//	}
	//	setReviews([...reviews(), { text: newReview(), votes: 0 }]);
	//	setNewReview(""); // Clear the input box
	//};
	//
	//const handleReviewVote = (index: number, delta: number) => {
	//	const updatedReviews = [...reviews()];
	//	updatedReviews[index].votes += delta;
	//	setReviews(updatedReviews);
	//};

	//return post ? (
	//	<div class="post-view-container">
	//		<h1 class="post-title">{post.title}</h1>
	//		<p class="post-meta">
	//			By {post.author} on {post.date}
	//		</p>
	//		<iframe
	//			src={post.pdf}
	//			height="500"
	//			width="100%"
	//			class="pdf-viewer"
	//		></iframe>
	//
	//		<div class="voting-section">
	//			<button class="voting-button upvote" onClick={handlePostUpvote}>
	//				Upvote
	//			</button>
	//			<button
	//				class="voting-button downvote"
	//				onClick={handlePostDownvote}
	//			>
	//				Downvote
	//			</button>
	//			<p class="vote-count">Post Votes: {postVotes()}</p>
	//		</div>
	//
	//		<div class="reviews-container">
	//			<h2 class="reviews-header">Reviews</h2>
	//			<div class="review-list">
	//				{reviews().length > 0 ? (
	//					reviews().map((review, index) => (
	//						<div class="review-item">
	//							<div>
	//								<p class="review-text">{review.text}</p>
	//								<p class="review-votes">
	//									Votes: {review.votes}
	//								</p>
	//							</div>
	//							<div class="review-buttons">
	//								<button
	//									class="review-button upvote"
	//									onClick={() =>
	//										handleReviewVote(index, 1)
	//									}
	//								>
	//									Upvote
	//								</button>
	//								<button
	//									class="review-button downvote"
	//									onClick={() =>
	//										handleReviewVote(index, -1)
	//									}
	//								>
	//									Downvote
	//								</button>
	//							</div>
	//						</div>
	//					))
	//				) : (
	//					<p class="text-gray-500">
	//						No reviews yet. Be the first to review!
	//					</p>
	//				)}
	//			</div>
	//
	//			<textarea
	//				class="review-input"
	//				rows="3"
	//				placeholder="Write your review here..."
	//				value={newReview()}
	//				onInput={(e) => setNewReview(e.target.value)}
	//			></textarea>
	//			<button class="submit-button" onClick={submitReview}>
	//				Submit Review
	//			</button>
	//		</div>
	//	</div>
	//) : (
	//	<div class="text-center text-red-500">Post not found</div>
	//);
};

export default PostView;
