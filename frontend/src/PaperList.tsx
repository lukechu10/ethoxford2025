import { Component, createEffect, createResource, For, Show } from "solid-js";
import * as provider from "./provider";
import PaperItem from "./components/PaperItem";
import { A } from "@solidjs/router";

const PostList: Component = () => {
	const [papers, { }] = createResource(() => provider.getAllPapers());
	createEffect(() => {
		console.log(papers());
	});

	return (
		<div class="max-w-prose mx-auto pt-5">
			<h1 class="text-4xl font-bold mb-8">Latest Papers</h1>

			<ul>
				<A
					href="/upload"
					class="flex flex-row bg-slate-800 my-4 p-4 rounded-xl transition hover:-translate-y-1 hover:bg-linear-to-br hover:from-orange-700 hover:to-orange-800 font-bold"
				>
					<i class="bi bi-file-earmark-arrow-up mr-5"></i>
					Upload a new paper
				</A>
				<Show when={papers()}>
					<For each={papers()}>
						{(paper) => <PaperItem paper={paper} />}
					</For>
				</Show>
			</ul>
		</div>
	);
};

export default PostList;
