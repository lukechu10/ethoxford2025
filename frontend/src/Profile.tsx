import { useParams } from "@solidjs/router";
import * as provider from "./provider";
import { Component, Show, createResource, For } from "solid-js";

const ProfilePage = () => {
    const params = useParams();
    const [rep] = createResource(() => provider.getReputation(params.profileId));
    const [papers] = createResource(() => provider.getAllPapers());
    console.log(provider);
  
    return (
      <>
        <div class="max-w-prose mx-auto flex flex-col justify-items-center">
        <h1 class="text-2xl">Profile: {params.profileId}</h1>
          <div class="text-6xl mx-auto mb-8">{Number(rep())} Reputation</div>
          <For each={papers()}>
            {(paper) => (
              <Show when={paper.author == params.profileId}>
                <div class="card bg-base-300 rounded-box grid h-20 place-items-center hover:bg-sky-700">
                  {paper.title}
                </div>
              </Show>
            )}
          </For>
        </div>
      </>
    );
  };
  

export default ProfilePage;
