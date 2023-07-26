import Head from 'next/head';
import type { AppProps } from 'next/app';
import Header from '../components/header';
import './styles/global.css';
const App = ({ Component, pageProps }: AppProps) => {
	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0"
				/>
				<meta name="description" content="PokeFront" />
				<link rel="stylesheet" href="/styles/global.css" />
				<title>PokeFront</title>
			</Head>
			<main>
				<Header></Header>
				<Component {...pageProps}></Component>
			</main>
		</>
	);
};

export default App;
