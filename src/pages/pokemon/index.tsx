import axios from 'axios';
import { useState } from 'react';

export async function getServerSideProps() {
	try {
		const response = await axios.get(
			'https://pokeapi.co/api/v2/pokemon?limit=20&offset=00'
		);
		const data = response.data;
		return {
			props: {
				data
			}
		};
	} catch (error) {
		return {
			props: {
				data: { results: [] }
			}
		};
	}
}

interface PokemonResponse {
	count: number;
	next: string;
	previous: string;
	results: { name: string }[];
}

export default function Pokemon({ data }: { data: PokemonResponse }) {
	const [pokemons, setPokemon] = useState(data.results);
	const [req, setReq] = useState(data);

	const fetchDataFromAPI = async () => {
		try {
			const res = await axios.get(req.next);
			console.log(req.next);

			const newData = res.data;
			setPokemon(newData.results);
			setReq(res.data);
		} catch (error) {
			console.error(
				"Erreur lors de la récupération des données depuis l'API:",
				error
			);
		}
	};
	return (
		<section className="">
			<button onClick={fetchDataFromAPI}>Charger depuis l'API</button>
			<ul>
				{pokemons.length === 0 ? (
					<div>Loading...</div>
				) : (
					pokemons.map(pokemon => (
						<li key={pokemon.name}>{pokemon.name}</li>
					))
				)}
			</ul>
		</section>
	);
}
