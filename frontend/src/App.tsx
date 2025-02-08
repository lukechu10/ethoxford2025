import { createContext, createResource, createSignal, Match, Suspense, Switch, useContext, type Component } from 'solid-js';
import { ethers, JsonRpcSigner } from "ethers";
import PostList from './PostList';

import ABI from "../../contracts/abi.json";

import { getSigner, SignerContext } from "./provider";

declare global {
	interface Window {
		ethereum: any;
	}
}

const provider = new ethers.BrowserProvider(window.ethereum);

const App: Component = () => {
	if (!window.ethereum) {
		return <div>Install the MetaMask browser extension.</div>
	}

	const [signer, setSigner] = createSignal<JsonRpcSigner | null>(null);

	const connectWallet = async () => {
		setSigner(await getSigner());
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

		<TestContract />

		<PostList />
	</>);
}

const CONTRACT_ADDRESS = "0xe6cEbb6bdDc02e86c741555b431f1316eE592C72";

const TestContract: Component = () => {
	const signer = useContext(SignerContext)!;
	const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
	console.log(contract);
	(async() => {
		console.log(await contract.set(123));
	})();
	return (<>

	</>)
}

export default App;
// test for postview page
// import { Router, Route } from "@solidjs/router";
// import { Component } from "solid-js";
// import PostList from "./PostList";
// import PostView from "./postview";

// const App: Component = () => {
//   return (
//     <Router>
//         <Route path="/" component={PostList} />
//         <Route path="/post/:id" component={PostView} />
//     </Router>
//   );
// };

// export default App;

