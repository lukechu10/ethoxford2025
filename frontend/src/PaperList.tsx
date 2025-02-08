import { Component, createEffect, createResource, For, Show } from "solid-js";
import * as provider from "./provider";
import PaperItem from "./components/PaperItem";

const PostList: Component = () => {
	const [papers, {}] = createResource(() => provider.getAllPapers());
	createEffect(() => {
		console.log(papers());
	});

	return (
		<div class="max-w-prose mx-auto pt-5">
			<h1 class="text-4xl font-bold mb-8">Latest Papers</h1>

			<ul>
				<Show when={papers()}>
					<For each={papers()}>
						{(paper) => (<PaperItem paper={paper} />)}
					</For>
				</Show>
			</ul>
		</div>
	);
};

export default PostList;
