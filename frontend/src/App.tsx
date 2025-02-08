import { createResource, createSignal, Match, Show, Suspense, Switch, type Component } from 'solid-js';
import { ethers, JsonRpcSigner } from "ethers";

declare global {
	interface Window {
		ethereum: any;
	}
}

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
					<MainView wallet={wallet()!} />
				)}
			</div>
		</div>
	)
}

const MainView: Component<{ wallet: JsonRpcSigner }> = (props) => {
	const [address, { mutate, refetch }] = createResource(() => props.wallet.getAddress());

	return (<>
		<ul class="menu menu-horizontal bg-base-200 rounded-box">
			<li><a href="/">DeSci</a></li>
		</ul>

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
	</>);
}

export default App;
