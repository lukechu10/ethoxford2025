import { Component, For } from "solid-js"

interface PostData {
	title: string;
	abstract: string;
	author: string;
	date: Date;
	votes: number;
}

const mockData: PostData[] = [
	{
		title: "Hello, world!",
		abstract: "This is a test post.",
		author: "Alice",
		date: new Date(1990, 1, 1),
		votes: +20,
	},
	{
		title: "Boop",
		abstract: "This is another test post.",
		author: "Bob",
		date: new Date(1990, 1, 2),
		votes: -30,
	}
]

const PostList: Component = () => {
	return (
		<div class="max-w-prose mx-auto">
			<h1 class="text-2xl font-bold">Latest Posts</h1>

			<ul class="list bg-base-100 rounded-box shadow-md">
				<For each={mockData}>
					{(post) => (
						<li class="list-row">
							<div>
								<i class="bi bi-arrow-up"></i>
								{post.votes}
							</div>
							<div>
								<p class="text-lg font-bold">{post.title}</p>
								<p class="text-sm italic">
									{post.author} {post.date.toLocaleString()}
								</p>

								<p>{post.abstract}</p>
							</div>
						</li>
					)}
				</For>
			</ul>
		</div>
	)
}

export default PostList;
