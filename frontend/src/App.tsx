import {
	createResource,
	createSignal,
	Match,
	Suspense,
	Switch,
	useContext,
	lazy,
	type Component,
	ParentComponent,
} from "solid-js";
import { JsonRpcSigner } from "ethers";

import * as provider from "./provider";
import { SignerContext } from "./provider";
import { A, Route, Router } from "@solidjs/router";

const PaperList = lazy(() => import("./PaperList"));
const PaperView = lazy(() => import("./PaperView"));
const UploadPaper = lazy(() => import("./UploadPaper"));
const ProfilePage = lazy(() => import("./Profile"));

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
	connectWallet();

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

const Layout: ParentComponent = (props) => {
	const wallet = useContext(SignerContext)!;
	const [address, {}] = createResource(() => wallet.getAddress());

	const copyAddress = () => {
		navigator.clipboard.writeText(address()!);
	};

	return (
		<>
			<div class="navbar bg-slate-800 border-b-2 border-b-slate-600 shadow-sm font-mono">
				<div class="pl-5 flex-none">
					<A href="/" class="text-xl font-bold font-mono inline-block px-3 py-1 hover:bg-slate-700 rounded-lg transition-colors">
						ChainReview
					</A>
				</div>
				<div class="flex-1"></div>
				<div class="flex-none">
					<Suspense fallback={<div>Loading...</div>}>
						<Switch>
							<Match when={address.error}>
								Error: {address.error}
							</Match>
							<Match when={address()}>
								<span class="mr-5 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-lg">
									<A
										class="hover:underline"
										href={`/profile/${address()}`}
									>
										{address()!.substring(0, 10)!}...
									</A>
									<i
										class="bi bi-clipboard ml-4 inline-block transition hover:-translate-y-0.5 cursor-pointer"
										onClick={copyAddress}
									></i>
								</span>
							</Match>
						</Switch>
					</Suspense>
				</div>
			</div>
			{props.children}
		</>
	);
};

const MainView: Component = () => {
	return (
		<Router root={Layout}>
			<Route path="/" component={PaperList} />
			<Route path="/paper/:id" component={PaperView} />
			<Route path="/upload" component={UploadPaper} />
			<Route path="/profile/:profileId" component={ProfilePage} />
		</Router>
	);
};

export default App;
