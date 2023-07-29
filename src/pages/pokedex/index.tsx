'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PokemonCollection from '../../components/PokemonCollection';
import { Pokemon } from './interface';

interface Pokemons {
	name: string;
	url: string;
}

const beginUrl = 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=20';

function Pokédex() {
	const [pokemons, setPokemons] = useState<Pokemon[]>([]);
	// const [currentUrl, setCurrentUrl] = useState<string>('');
	const [nextUrl, setNextUrl] = useState<string>('');
	const [prevUrl, setPrevUrl] = useState<string>('');

	useEffect(() => {
		const getPokemon = async () => {
			const res = await axios.get(beginUrl);

			console.log('data : ', res.data);
			setNextUrl(res.data.next);
			setPrevUrl(res.data.previous);

			res.data.results.forEach(async (pokemon: Pokemons) => {
				const poke = await axios.get(
					`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
				);

				setPokemons(p => [...p, poke.data]);
			});
		};

		getPokemon();
	}, []);

	const prevPage = async () => {
		let res = await axios.get(prevUrl);
		setPrevUrl(prevUrl);

		res.data.results.forEach(async (pokemon: Pokemons) => {
			const poke = await axios.get(
				`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
			);

			setPokemons(p => [...p, poke.data]);
		});
	};

	const nextPage = async () => {
		let res = await axios.get(nextUrl);
		setNextUrl(nextUrl);

		res.data.results.forEach(async (pokemon: Pokemons) => {
			const poke = await axios.get(
				`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
			);

			setPokemons(p => [...p, poke.data]);
		});
	};

	return (
		<>
			<PokemonCollection pokemons={pokemons} />
			<button onClick={prevPage}>Page précédente</button>
			<button onClick={nextPage}>Page suivante</button>
		</>
	);
}
export default Pokédex;
