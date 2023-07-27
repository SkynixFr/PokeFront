import Link from 'next/link';

const Home = () => {
	return (
		<>
			<h1>Hello !</h1>
			<main>
				<Link href="/pokemon">Pokémon</Link>
				<div>
					<h1></h1>
				</div>
				<Link href="/pokedex">Pokédex</Link>
			</main>
		</>
	);
};

export default Home;
