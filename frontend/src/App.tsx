import { createContext, createResource, createSignal, Match, Show, Suspense, Switch, useContext, type Component } from 'solid-js';
import { ethers, JsonRpcSigner } from "ethers";
import PostList from './PostList';

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
