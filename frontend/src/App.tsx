import {
	createResource,
	createSignal,
	Match,
	Suspense,
	Switch,
	useContext,
	type Component,
} from "solid-js";
import { JsonRpcSigner } from "ethers";
import PostList from "./PostList";
import PostView from "./PostView";
import UploadPaper from "./Uploadpaper";

import * as provider from "./provider";
import { SignerContext } from "./provider";
import { Route, Router } from "@solidjs/router";

declare global {
	interface Window {
		ethereum: any;
	}
}

const App: Component = () => {
	if (!window.ethereum) {
		return <div>Install the MetaMask browser extension.</div>;
	}

	const [signer, setSigner] = createSignal<JsonRpcSigner | null>(null);

	const connectWallet = async () => {
		setSigner(await provider.getSigner());
	};

	return (
		<div class="app">
			<div>
				{signer() === null ? (
					<button class="btn" onClick={connectWallet}>
						Connect Wallet
					</button>
				) : (
					<SignerContext.Provider value={signer()!}>
						<MainView />
					</SignerContext.Provider>
				)}
			</div>
		</div>
	);
};

const MainView: Component = () => {
	const wallet = useContext(SignerContext)!;
	const [address, { mutate, refetch }] = createResource(() =>
		wallet.getAddress()
	);

	console.log(provider);

	return (
		<Router>
			<div class="navbar bg-base-100 shadow-sm">
				<div class="flex-none">DeSci</div>
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

			<Route path="/" component={PostList} />
			<Route path="/paper/:id" component={PostView} />
			<Route path="/upload" component={UploadPaper} />
		</Router>
	);
};

export default App;
