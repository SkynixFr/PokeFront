import Head from 'next/head';
import type { AppProps } from 'next/app';
import Header from '../components/header';
import { useRouter } from 'next/router';
import '../styles/styles.scss';
import MouseFollower from '../components/mouseFollower';
import { useEffect } from 'react';

const App = ({ Component, pageProps }: AppProps) => {
	const router = useRouter();

	useEffect(() => {
		if (router.asPath === '/') {
			router.push('/login');
		}
	}, []);
	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0"
				/>
				<meta name="description" content="PokeFront" />
				<title>PokeFront</title>
			</Head>
			<main>
				<MouseFollower></MouseFollower>

				{router.asPath === '/login' || router.asPath === '/register' ? (
					''
				) : (
					<Header></Header>
				)}
				<Component {...pageProps}></Component>
			</main>
		</>
	);
};

export default App;
