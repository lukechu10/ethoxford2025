import { createContext, createResource, createSignal, Match, Show, Suspense, Switch, useContext, type Component } from 'solid-js';
import { ethers, JsonRpcSigner } from "ethers";
import PostList from './PostList';
import PostView from './postview';
import { Router, Route } from "@solidjs/router";


declare global {
	interface Window {
		ethereum: any;
	}
}

const WalletContext = createContext<JsonRpcSigner>();

const App: Component = () => {
	if (!window.ethereum) {
		return <div>Install the MetaMask browser extension.</div>
	}

	const provider = new ethers.BrowserProvider(window.ethereum);
	console.log(provider);

	const [wallet, setWallet] = createSignal<JsonRpcSigner | null>(null);

	const connectWallet = async () => {
		await provider.send("eth_requestAccounts", []);
		const signer = await provider.getSigner();
		setWallet(signer);
	}

	return (
		<div class="app">
			<div>
				{wallet() === null ? (
					<button class="btn" onClick={connectWallet}>Connect Wallet</button>
				) : (
					<WalletContext.Provider value={wallet()!}>
						<MainView />
					</WalletContext.Provider>
				)}
			</div>
		</div>
		
	)
}

const MainView: Component = () => {
	const wallet = useContext(WalletContext)!;
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

