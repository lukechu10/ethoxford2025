import { createContext, createResource, createSignal, Match, Suspense, Switch, useContext, type Component } from 'solid-js';
import { ethers, JsonRpcSigner } from "ethers";
import PostList from './PostList';

import ABI from "../../contracts/abi.json";

import * as provider from "./provider";
import { SignerContext } from './provider';

declare global {
	interface Window {
		ethereum: any;
	}
}

const App: Component = () => {
	if (!window.ethereum) {
		return <div>Install the MetaMask browser extension.</div>
	}

	const [signer, setSigner] = createSignal<JsonRpcSigner | null>(null);

	const connectWallet = async () => {
		setSigner(await provider.getSigner());
	}

	return (
		<div class="app">
			<div>
				{signer() === null ? (
					<button class="btn" onClick={connectWallet}>Connect Wallet</button>
				) : (
					<SignerContext.Provider value={signer()!}>
						<MainView />
					</SignerContext.Provider>
				)}
			</div>
		</div>
		
	)
}

const MainView: Component = () => {
	const wallet = useContext(SignerContext)!;
	const [address, { mutate, refetch }] = createResource(() => wallet.getAddress());

	console.log(provider);

	return (<>
		<div class="navbar bg-base-100 shadow-sm">
			<div class="flex-none">
				DeSci
			</div>
			<div class="flex-1"></div>
			<div class="flex-none">
				<Suspense fallback={<div>Loading...</div>}>
					<Switch>
						<Match when={address.error}>
							Error: {address.error}
						</Match>
						<Match when={address()}>
							Address: {address()!}
						</Match>
					</Switch>
				</Suspense>
			</div>
		</div>

		<PostList />
	</>);
}

export default App;

// // test for postview page
// import { Router, Route } from "@solidjs/router";
// import { Component } from "solid-js";
// import PostList from "./PostList";
// import PostView from "./postview";
// import UploadPaper from "./Uploadpaper";


// const App: Component = () => {
//   return (
//     <Router>
//         <h1 class="text-2xl font-bold text-center my-4">DeSci Platform</h1>

//         <nav class="flex justify-center space-x-4 mb-6">
//           <a href="/" class="text-blue-500 hover:underline">Home</a>
//           <a href="/upload" class="text-blue-500 hover:underline">Upload Paper</a>
//         </nav> 

//         <Route path="/" component={PostList} />
//         <Route path="/post/:id" component={PostView} />
// 		<Route path="/upload" component={UploadPaper} /> {/* New Route */}

//     </Router>
//   );
// };

// export default App;

