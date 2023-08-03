import axios from 'axios';
import { useState } from 'react';
import PokedexCard from '../../components/pokedexCard';
import pokedexTitle from '../../public/images/pokedex-title.png';
import Image from 'next/image';
import {
	FaMagnifyingGlass,
	FaArrowLeft,
	FaArrowRight,
	FaArrowDownShortWide,
	FaArrowDownWideShort
} from 'react-icons/fa6';
import spriteDefault from '../../public/images/sprite_default.png';
import checkmark from '../../public/images/checkmark.svg';
import axiosInstancePublic from '../../services/axiosInstancePublic';
import { useRouter } from 'next/router';
import zarbi from '../../public/images/zarbi.png';
import professeurChen from '../../public/images/professeur-chen.png';

interface Pokemons {
	name: string;
	url: string;
}

interface TypeInfo {
	type: {
		name: string;
	};
}

interface PokemonData {
	id: string;
	name: string;
	types: string[];
	sprite: string;
}

interface FullPokemonData {
	pokemons: PokemonData[];
	next: string;
	previous: string;
}

export async function getServerSideProps() {
	try {
		const responsePokemon = await axios.get(
			'https://pokeapi.co/api/v2/pokemon?limit=20&offset=00'
		);

		const pokemons = responsePokemon.data;
		const { next, previous } = responsePokemon.data;

		const pokemonDetails = await Promise.all(
			pokemons.results.map(async (pokemon: Pokemons) => {
				try {
					const responsePokemonDetail = await axios.get(
						`https://pokeapi.co/api/v2/pokemon/${pokemon.name.toLowerCase()}`
					);

					const pokemonDetail = responsePokemonDetail.data;

					const [firstChar, ...restofChars] = pokemonDetail.name;
					const capitalizedName = `${firstChar.toUpperCase()}${restofChars.join(
						''
					)}`;

					return {
						name: capitalizedName,
						id: pokemonDetail.id,
						sprite: pokemonDetail.sprites.front_default,
						types: pokemonDetail.types.map(
							(typeInfo: TypeInfo) => typeInfo.type.name
						)
					};
				} catch (error) {
					if (axios.isAxiosError(error)) {
						console.error(
							`Error fetching Pokémon details for ${pokemon.name}`
						);
						return {
							props: {}
						};
					}
				}
			})
		);

		const filteredPokemons = pokemonDetails.filter(
			pokemon => pokemon !== null
		);

		const fullPokemonData = {
			pokemons: filteredPokemons,
			next,
			previous
		};

		return {
			props: {
				pokemons: fullPokemonData
			}
		};
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return {
				props: {
					pokemons: []
				}
			};
		}
	}
}

const Pokedex = ({ pokemons }: { pokemons: FullPokemonData }) => {
	const [pokemonDetails, setPokemonDetails] = useState<PokemonData[]>(
		pokemons.pokemons
	);
	const [next, setNext] = useState<string>(pokemons.next);
	const [prev, setPrev] = useState<string>(pokemons.previous);
	const [originalPokemonData, setOriginalPokemonData] = useState<
		PokemonData[]
	>(pokemons.pokemons);
	const [originalNext, setOriginalNext] = useState<string>(pokemons.next);
	const [originalPrev, setOriginalPrev] = useState<string>(pokemons.previous);
	const [sortOption, setSortOption] = useState<'asc' | 'desc' | 'name'>('asc');
	const [formData, setFormData] = useState<{ [key: string]: string }>({});
	const types = [
		'grass',
		'fire',
		'bug',
		'dark',
		'dragon',
		'electric',
		'fairy',
		'fighting',
		'flying',
		'ghost',
		'normal',
		'ground',
		'ice',
		'poison',
		'psychic',
		'rock',
		'steel',
		'water'
	];
	const [selectedPokemon, setSelectedPokemon] = useState<string[]>([]);
	const [useCustomFont, setUseCustomFont] = useState(false);
	const router = useRouter();

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const searchData = formData.searchData?.toLowerCase?.();

		if (!searchData || searchData === '') {
			setPokemonDetails(originalPokemonData);
		} else if (types.includes(searchData)) {
			try {
				const responsePokemon = await axios.get(
					`https://pokeapi.co/api/v2/type/${searchData}`
				);

				const updatedPokemons = await Promise.all(
					responsePokemon.data.pokemon.map(async (pokemon: any) => {
						try {
							const responsePokemonDetail = await axios.get(
								`https://pokeapi.co/api/v2/pokemon/${pokemon.pokemon.name}`
							);

							const pokemonDetail = responsePokemonDetail.data;

							const [firstChar, ...restofChars] = pokemonDetail.name;
							const capitalizedName = `${firstChar.toUpperCase()}${restofChars.join(
								''
							)}`;

							return {
								name: capitalizedName,
								id: pokemonDetail.id,
								sprite: pokemonDetail.sprites.front_default
									? pokemonDetail.sprites.front_default
									: spriteDefault,
								types: pokemonDetail.types.map(
									(typeInfo: TypeInfo) => typeInfo.type.name
								)
							};
						} catch (error) {
							console.error(
								`Error fetching Pokémon details for ${pokemon.pokemon.name}`
							);
							return null;
						}
					})
				);

				const filteredPokemons = updatedPokemons.filter(
					pokemon => pokemon !== null
				);

				setNext('');
				setPrev('');
				setPokemonDetails(filteredPokemons);
			} catch (error) {
				console.error(error);
			}
		} else {
			try {
				const responsePokemon = await axios.get(
					`https://pokeapi.co/api/v2/pokemon/${searchData}`
				);

				const pokemonDetail = responsePokemon.data;

				const [firstChar, ...restofChars] = pokemonDetail.name;
				const capitalizedName = `${firstChar.toUpperCase()}${restofChars.join(
					''
				)}`;

				const updatedPokemons = [
					{
						name: capitalizedName,
						id: pokemonDetail.id,
						sprite: pokemonDetail.sprites.front_default
							? pokemonDetail.sprites.front_default
							: spriteDefault,
						types: pokemonDetail.types.map(
							(typeInfo: TypeInfo) => typeInfo.type.name
						)
					}
				];

				const filteredPokemons = updatedPokemons.filter(
					pokemon => pokemon !== null
				);

				setNext('');
				setPrev('');
				setPokemonDetails(filteredPokemons);
			} catch (error) {
				console.error(error);
			}
		}
	}

	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });

		if (name === 'searchData' && value.trim() === '') {
			setPokemonDetails(pokemons.pokemons);
			setNext(originalNext);
			setPrev(originalPrev);
		}
	}

	function handleSort(option: 'asc' | 'desc' | 'name') {
		setSortOption(option);
		setPokemonDetails(prevPokemons =>
			[...prevPokemons].sort((pokemonA, pokemonB) => {
				switch (option) {
					case 'asc':
						return parseInt(pokemonA.id) - parseInt(pokemonB.id);
					case 'desc':
						return parseInt(pokemonB.id) - parseInt(pokemonA.id);
					case 'name':
						return pokemonA.name.localeCompare(pokemonB.name);
					default:
						return 0;
				}
			})
		);
	}

	async function handleReqNext() {
		try {
			const responsePokemon = await axios.get(next);
			setNext(responsePokemon.data.next);
			setPrev(responsePokemon.data.previous);

			const updatedPokemons = await Promise.all(
				responsePokemon.data.results.map(async (pokemon: Pokemons) => {
					const responsePokemonDetail = await axios.get(
						`https://pokeapi.co/api/v2/pokemon/${pokemon.name.toLowerCase()}`
					);

					const pokemonDetail = responsePokemonDetail.data;

					const [firstChar, ...restofChars] = pokemonDetail.name;
					const capitalizedName = `${firstChar.toUpperCase()}${restofChars.join(
						''
					)}`;

					if (pokemonDetail.id && pokemonDetail.id <= 1010) {
						return {
							name: capitalizedName,
							id: pokemonDetail.id,
							sprite: pokemonDetail.sprites.front_default
								? pokemonDetail.sprites.front_default
								: spriteDefault,
							types: pokemonDetail.types.map(
								(typeInfo: TypeInfo) => typeInfo.type.name
							)
						};
					} else {
						setNext('');
						return null;
					}
				})
			);

			const filteredPokemons = updatedPokemons.filter(
				pokemon => pokemon !== null
			);
			setPokemonDetails(filteredPokemons);
		} catch (error) {
			console.error(error);
		}
	}

	async function handleReqPrev() {
		try {
			const responsePokemon = await axios.get(prev);
			setNext(responsePokemon.data.next);
			setPrev(responsePokemon.data.previous);

			const updatedPokemons = await Promise.all(
				responsePokemon.data.results.map(async (pokemon: Pokemons) => {
					const responsePokemonDetail = await axios.get(
						`https://pokeapi.co/api/v2/pokemon/${pokemon.name.toLowerCase()}`
					);

					const pokemonDetail = responsePokemonDetail.data;

					const [firstChar, ...restofChars] = pokemonDetail.name;
					const capitalizedName = `${firstChar.toUpperCase()}${restofChars.join(
						''
					)}`;

					return {
						name: capitalizedName,
						id: pokemonDetail.id,
						sprite: pokemonDetail.sprites.front_default
							? pokemonDetail.sprites.front_default
							: spriteDefault,
						types: pokemonDetail.types.map(
							(typeInfo: TypeInfo) => typeInfo.type.name
						)
					};
				})
			);

			const filteredPokemons = updatedPokemons.filter(
				pokemon => pokemon !== null
			);

			setPokemonDetails(filteredPokemons);
		} catch (error) {
			console.error(error);
		}
	}

	function handleSavePokemon(name: string) {
		setSelectedPokemon(prevSelected =>
			prevSelected.includes(name)
				? prevSelected.filter(selectedName => selectedName !== name)
				: [...prevSelected, name]
		);
	}

	async function submitPokemons() {
		try {
			await axiosInstancePublic.post('/users/pokemons', {
				pokemons: selectedPokemon
			});

			router.push('/user/me');
		} catch (error) {
			console.error(error);
		}
	}

	function handleChangeFont() {
		setUseCustomFont(!useCustomFont);
	}

	return (
		<section className="pokedex">
			<div className="secret-zarbi">
				<Image
					src={zarbi}
					alt="zarbi"
					priority
					onClick={handleChangeFont}
				/>
			</div>

			<div className="professeur-chen">
				<Image
					src={professeurChen}
					alt="professeurChen"
					priority
					onClick={handleChangeFont}
				/>
			</div>

			<div className="pokedex-title">
				<Image src={pokedexTitle} alt="Pokedex title" priority></Image>
			</div>
			<div className="pokedex-container">
				<div className="pokedex-filters">
					<div className="pokedex-searchbar">
						<form onSubmit={handleSubmit}>
							<input
								type="search"
								name="searchData"
								id="searchData"
								placeholder="Rechercher des pokemons par ID/Nom/Type"
								onChange={handleChange}
							/>
							<div className="search-icon">
								<FaMagnifyingGlass />
							</div>
						</form>
					</div>
					<div className="pokedex-sort">
						<ul>
							<li>
								<input
									type="radio"
									name="sortOption"
									id="name"
									defaultChecked={sortOption === 'name'}
									onClick={() => handleSort('name')}
								/>
								<label htmlFor="sortAZ" className="pokedex-sort-icon">
									A-Z
								</label>
							</li>
							<li>
								<input
									type="radio"
									name="sortOption"
									id="asc"
									defaultChecked={sortOption === 'asc'}
									onClick={() => handleSort('asc')}
								/>
								<label
									htmlFor="sortIDAsc"
									className="pokedex-sort-icon"
								>
									<span>ID</span> <FaArrowDownShortWide />
								</label>
							</li>
							<li>
								<input
									type="radio"
									name="sortOption"
									id="desc"
									defaultChecked={sortOption === 'desc'}
									onClick={() => handleSort('desc')}
								/>
								<label
									htmlFor="sortIDDesc"
									className="pokedex-sort-icon"
								>
									<span>ID</span>
									<FaArrowDownWideShort />
								</label>
							</li>
						</ul>
					</div>
				</div>
				<div className="pokedex-pokemons">
					{prev && (
						<button className="pagination prev" onClick={handleReqPrev}>
							<FaArrowLeft />
						</button>
					)}

					<div className="pokedex-cards">
						{pokemonDetails.map(pokemon => (
							<div
								className={`pokedex-card-add ${
									selectedPokemon.includes(pokemon.name)
										? 'selected'
										: ''
								}`}
								key={pokemon.id}
								onClick={() => handleSavePokemon(pokemon.name)}
							>
								{selectedPokemon.includes(pokemon.name) && (
									<div className="checkmark-container">
										<Image
											src={checkmark}
											alt="Checkmark"
											width={24}
											height={24}
										/>
									</div>
								)}
								<PokedexCard
									pokemon={pokemon}
									key={pokemon.id}
									useCustomFont={useCustomFont}
								></PokedexCard>
							</div>
						))}
					</div>
					{next && (
						<button className="pagination next" onClick={handleReqNext}>
							<FaArrowRight />
						</button>
					)}
				</div>
				<div className="add-pokemon">
					<button
						onClick={submitPokemons}
						disabled={selectedPokemon.length < 1}
					>
						Ajouter les pokémons
					</button>
				</div>
			</div>
		</section>
	);
};

export default Pokedex;
