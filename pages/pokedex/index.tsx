// 'use client';
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import PokemonCollection from '../../components/PokemonCollection';
// import { Pokemon } from './interface';
// import getServerSideProps from '../../components/function';

// interface Pokemons {
// 	name: string;
// 	url: string;
// }

// const beginUrl = 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=20';

// function Pokédex() {
// 	const [pokemons, setPokemons] = useState<Pokemon[]>([]);
// 	// const [currentUrl, setCurrentUrl] = useState<string>('');
// 	const [nextUrl, setNextUrl] = useState<string>('');
// 	const [prevUrl, setPrevUrl] = useState<string>('');

// 	useEffect(() => {
// 		const getPokemon = async () => {
// 			const res = await axios.get(beginUrl);

// 			console.log('data : ', res.data);
// 			setNextUrl(res.data.next);
// 			setPrevUrl(res.data.previous);

// 			res.data.results.forEach(async (pokemon: Pokemons) => {
// 				const poke = await axios.get(
// 					`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
// 				);

// 				setPokemons(p => [...p, poke.data]);
// 			});
// 		};

// 		getPokemon();
// 	}, []);

// 	const prevPage = async () => {
// 		let res = await axios.get(prevUrl);
// 		setPrevUrl(prevUrl);

// 		res.data.results.forEach(async (pokemon: Pokemons) => {
// 			const poke = await axios.get(
// 				`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
// 			);

// 			setPokemons(p => [...p, poke.data]);
// 		});
// 	};

// 	const nextPage = async () => {
// 		let res = await axios.get(nextUrl);
// 		setNextUrl(nextUrl);

// 		res.data.results.forEach(async (pokemon: Pokemons) => {
// 			const poke = await axios.get(
// 				`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
// 			);

// 			setPokemons(p => [...p, poke.data]);
// 		});
// 	};

// 	const okok = getServerSideProps;

// 	return (
// 		<>
// 			<PokemonCollection pokemons={pokemons} />
// 			<button onClick={prevPage}>Page précédente</button>
// 			<button onClick={nextPage}>Page suivante</button>
// 		</>
// 	);
// }
// export default Pokédex;

import axios from 'axios';
import { useState } from 'react';
import { Pokemon } from './interface';

interface Pokemons {
	name: string;
	url: string;
}

export async function getServerSideProps() {
	try {
		const response = await axios.get(
			'https://pokeapi.co/api/v2/pokemon?limit=20&offset=00'
		);

		const data = response.data;
		console.log(data);

		const updatedResults = await Promise.all(
			data.results.map(async (pokemon: Pokemons) => {
				const poke = await axios.get(pokemon.url);
				// console.log(poke.data.id);
				// console.log(poke.data.types[0].type.name);

				const updatedPokemon = {
					...pokemon,
					id: poke.data.id,
					type: poke.data.types[0].type.name,
					image: poke.data.sprites.front_default
				};
				return updatedPokemon;
			})
		);

		data.results = updatedResults;
		console.log(data.results);

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
	results: { id: number; image: string; name: string; type: string }[];
}

export default function Pokemon({ data }: { data: PokemonResponse }) {
	const [pokemons, setPokemon] = useState(data.results);
	const [req, setReq] = useState(data);

	const fetchDataFromAPInext = async () => {
		try {
			if (req.next != null) {
				const res = await axios.get(req.next);
				console.log(req.next, res);

				const updatedResults = await Promise.all(
					res.data.results.map(async (pokemon: Pokemons) => {
						const poke = await axios.get(pokemon.url);

						const updatedPokemon = {
							...pokemon,
							id: poke.data.id,
							type: poke.data.types[0].type.name,
							image: poke.data.sprites.front_default
						};
						return updatedPokemon;
					})
				);

				const newData = res.data;
				newData.results = updatedResults;

				setPokemon(newData.results);
				setReq(res.data);
			} else {
				window.alert(
					'\nVous êtes sur la dernière page du pokédex \nImpossible de trouver une page suivante'
				);
			}
		} catch (error) {
			console.error(
				'Erreur lors de la récupération des pokémons suivants depuis PokeAPI',
				error
			);
		}
	};

	const fetchDataFromAPIprev = async () => {
		try {
			if (req.previous != null) {
				const res = await axios.get(req.previous);
				console.log(req.next);

				const updatedResults = await Promise.all(
					res.data.results.map(async (pokemon: Pokemons) => {
						const poke = await axios.get(pokemon.url);

						const updatedPokemon = {
							...pokemon,
							id: poke.data.id,
							type: poke.data.types[0].type.name,
							image: poke.data.sprites.front_default
						};
						return updatedPokemon;
					})
				);

				const newData = res.data;
				newData.results = updatedResults;

				setPokemon(newData.results);
				setReq(res.data);
			} else {
				window.alert(
					'\nVous êtes sur la première page du pokédex \nImpossible de trouver une page précédente'
				);
			}
		} catch (error) {
			console.error(
				'Erreur lors de la récupération des pokémons précedents depuis PokeAPI',
				error
			);
		}
	};
	return (
		<section className="">
			<button onClick={fetchDataFromAPIprev}>Précédent</button>
			<button onClick={fetchDataFromAPInext}>Suivant</button>
			<ul>
				{pokemons.length === 0 ? (
					<div>Loading...</div>
				) : (
					pokemons.map(pokemon => (
						<li key={pokemon.name}>
							# {pokemon.id} |{pokemon.name} |
							<img src={pokemon.image} /> | {pokemon.type}
						</li>
					))
				)}
			</ul>
		</section>
	);
}
