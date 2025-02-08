import { useParams } from "@solidjs/router";
import * as provider from "./provider";
import { Component, Show, createResource, For } from "solid-js";
import PaperItem from "./components/PaperItem";

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
                  <PaperItem paper={paper} />
              </Show>
            )}
          </For>
        </div>
      </>
    );
  };
  

export default ProfilePage;
