import { Component, createEffect, createResource, For, Show } from "solid-js";
import * as provider from "./provider";
import { A } from "@solidjs/router";

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
						{(paper) => (
							<div class="flex flex-row bg-gray-900 my-4 p-4 rounded-xl transition hover:-translate-y-1 hover:bg-linear-to-br hover:from-orange-700 hover:to-orange-800 group">
								<div class="w-10 py-1.5 mr-5 flex flex-col justify-center font-bold">
									<div class="group-hover:bg-orange-500 transition-colors flex flex-col rounded">
										<i class="mx-auto bi bi-chevron-double-up"></i>
										<span class="mx-auto">{paper.votes}</span>
									</div>
								</div>
								<div>
									<A href={`/paper/${paper.id}`} class="text-2xl font-bold">
										{paper.title}
									</A>
									<p class="text-sm text-primary-content">
										<span>{paper.timestamp.toDateString()}</span>
										<span class="ml-10">
											Author: 
											<span class="font-bold text-secondary-content">{paper.author.substring(0, 10)}...</span>
										</span>
									</p>

									<p class="mt-4">TODO: Abstract</p>
								</div>
							</div>
						)}
					</For>
				</Show>
			</ul>
		</div>
	);
};

export default PostList;
