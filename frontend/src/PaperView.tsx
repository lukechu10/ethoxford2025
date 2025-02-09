import {
	Component,
	createEffect,
	createMemo,
	createResource,
	createSignal,
	For,
	Show,
} from "solid-js";
import { A, useParams } from "@solidjs/router";
import * as provider from "./provider";
import EXAMPLE_PDF from "../assets/dummy.pdf";
import { createLatest } from "@solid-primitives/memo";

const PostView: Component = () => {
	const params = useParams();
	const paperId = params.id;

	const [paper, { }] = createResource(() => provider.getPaper(+paperId));
	console.log(provider.contract);

	const kudos = createMemo(() => paper()?.votes || 0);
	const [kudosEager, setKudosEager] = createSignal(0);

	const kudosLatest = createLatest([kudos, kudosEager]);

	const vote = async (upvote: boolean) => {
		await provider.votePaper(+paperId, upvote);
		const delta = upvote ? 1 : -1;
		setKudosEager(kudosLatest() + delta);
	};

	// TODO: use the url from the paper data in contract.
	return (
		<Show when={paper()}>
			<div class="max-w-prose mx-auto pt-5">
				<h1 class="font-bold text-4xl">{paper()!.title}</h1>
				<p class="text-gray-400">
					By{" "}
					<A
						href={`/profile/${paper()!.author}`}
						class="font-mono font-bold text-orange-200 hover:underline"
					>
						{paper()!.author}
					</A>{" "}
					on {paper()!.timestamp.toDateString()}
				</p>
			</div>
			<div class="w-full px-20 mb-10 flex flex-row gap-5">
				<div class="flex-grow">
					<iframe
						title="pdf"
						src={EXAMPLE_PDF}
						height="500"
						width="100%"
						class="mt-10"
					></iframe>
				</div>
				<div class="flex-grow mt-10">
					<h2 class="font-bold text-3xl mt-5 mb-2">
						Kudos: {kudosLatest()}
					</h2>
					<p class="text-gray-400">
						Show your support by sending kudos straight from your
						crypto wallet.
					</p>
					<div class="mt-5 flex flex-row justify-items-around">
						<button
							type="button"
							class="btn bg-orange-600 hover:bg-orange-700 w-12 h-12 rounded-full"
							onClick={() => vote(true)}
						>
							+1
						</button>
						<div class="w-7" />
						<button
							type="button"
							class="btn bg-gray-600 hover:bg-gray-700 w-12 h-12 rounded-full"
							onClick={() => vote(false)}
						>
							-1
						</button>
					</div>

					<div class="divider" />

					<ReviewsList paper={paper()!} />
				</div>
			</div>
		</Show>
	);
};

const ReviewsList = ({ paper }: { paper: provider.Paper }) => {
	const [comment, setComment] = createSignal("");

	const submitComment = async () => {
		const commentTrimmed = comment().trim();
		if (commentTrimmed === "") {
			return;
		}
		console.log(`Comment: ${comment()}`);
		await provider.submitReview(paper.id, commentTrimmed);
	};

	const [reviewIds, { }] = createResource(() =>
		provider.getPaperReviews(paper.id),
	);
	const [reviews, { }] = createResource(reviewIds, (reviewIds: any) =>
		Promise.all(reviewIds?.map((id: number) => provider.getReview(id))),
	);
	createEffect(() => console.log(reviews()));

	return (
		<div class="reviews">
			<h2 class="font-bold text-3xl my-5">Comments</h2>
			<Show when={reviews()?.length === 0}>
				<p class="text-gray-400">
					No reviews yet. Be the first to review!
				</p>
			</Show>
			<ul>
				<For each={reviews()}>
					{(review, i) => (
						<li>
							{i() + 1}. {review.comment}
						</li>
					)}
				</For>
			</ul>

			<textarea
				class="block w-full p-3 mt-5 border rounded-md"
				rows="4"
				placeholder="Write a comment..."
				value={comment()}
				onInput={(e) => setComment(e.currentTarget.value)}
			/>
			<button
				class="mt-5 px-8 btn bg-orange-600 hover:bg-orange-700 rounded-full"
				onClick={submitComment}
			>
				Submit Comment
			</button>
		</div>
	);
};

export default PostView;
