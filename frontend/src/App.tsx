import { createContext, createResource, createSignal, Match, Show, Suspense, Switch, useContext, type Component } from 'solid-js';
import { ethers, JsonRpcSigner } from "ethers";

declare global {
	interface Window {
		ethereum: any;
	}
}

const WalletContext = createContext<JsonRpcSigner>();

const App: Component = () => {
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
			
			<li><a href="/">DeSci</a></li>

			<Suspense fallback={<div>Loading...</div>}>
				<Switch>
					<Match when={address.error}>
						<div>Error: {address.error}</div>
					</Match>
					<Match when={address()}>
						<div>Address: {address()!}</div>
					</Match>
				</Switch>
			</Suspense>
		</div>

	</>);
}

export default App;
