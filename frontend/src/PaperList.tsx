import { Component, createEffect, createResource, For, Show } from "solid-js";
import * as provider from "./provider";
import { A } from "@solidjs/router";

const PostList: Component = () => {
	const [papers, {}] = createResource(() => provider.getPapers());
	createEffect(() => {
		console.log(papers());
	});

	return (
		<div class="max-w-prose mx-auto">
			<h1 class="text-2xl font-bold">Latest Posts</h1>

			<ul class="list bg-base-100 rounded-box shadow-md">
				<Show when={papers()}>
					<For each={papers()}>
						{(paper) => (
							<A href={`/paper/${paper.id}`} class="list-row">
								<div>
									<i class="bi bi-arrow-up"></i>
									<p>{paper.votes}</p>
								</div>
								<div>
									<p class="text-lg font-bold">
										{paper.title}
									</p>
									<p class="text-sm">
										Author: <strong>{paper.author}</strong>
									</p>
									<p class="text-xs">
										{paper.timestamp.toLocaleString()}
									</p>

									<p>TODO: Abstract</p>
								</div>
							</A>
						)}
					</For>
				</Show>
			</ul>
		</div>
	);
};

export default PostList;
