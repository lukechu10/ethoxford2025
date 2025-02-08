import { useParams } from "@solidjs/router";
import * as provider from "./provider";
import { Component, Show, createResource, For } from "solid-js";

const ProfilePage = () => {
	const params = useParams();
	const [rep, {}] = createResource(() =>
		provider.getReputation(params.profileId),
	);
	const [papers, {}] = createResource(() => provider.getAllPapers());
	console.log(provider);

	return (
		<>
			<h1>{params.profileId}</h1>
			<h2>Reputation = {Number(rep())}</h2>
			<For each={papers()}>
				{(paper) => (
					<Show when={paper.author == params.profileId}>
						<div>{paper.title}</div>
					</Show>
				)}
			</For>
		</>
	);
};

export default ProfilePage;
