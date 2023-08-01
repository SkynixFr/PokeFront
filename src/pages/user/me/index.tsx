import React, { useState } from 'react';
import axios from 'axios';
import { faker } from '@faker-js/faker';
import { FaEnvelope, FaPencil, FaTrashCan } from 'react-icons/fa6';
import Image from 'next/image';
import PokedexCard from '../../../components/pokedexCard';

export async function getServerSideProps() {
	const avatar = faker.image.avatarGitHub();

	const jwtToken =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzM2OGFhNzAyZTUyMjE4NWQ0OGUyMCIsInVzZXJuYW1lIjoiTmV3dCIsImVtYWlsIjoibmV3dEBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRNYnl3UEZiWEZMLlowWk12SUZ0bGdPcU9vaVlZUVZicDF4aDBFdEh0cW5hTy8vaXp1T0EvTyIsInBva2VkZXgiOlsicGlrYWNodSIsInJpb2x1IiwiZWV2ZWUiXSwiY3JlYXRlZEF0IjoiMjAyMy0wNy0yOFQwNzowNToxNC40MDRaIiwidXBkYXRlQXQiOiIyMDIzLTA4LTAxVDEzOjQwOjI1LjM0NFoiLCJpYXQiOjE2OTA4OTk1NTYsImV4cCI6MTY5MDkwMDE1Nn0.fiAYrOhZeG09hWJO7SwJbKlm-wB0PvG57WP2Thua9lo';

	const config = {
		headers: {
			Authorization: `Bearer ${jwtToken}`
		}
	};

	try {
		const responseUser = await axios.get(
			'http://localhost:8080/api/v2/users/me',
			config
		);

		const responsePokemon = await axios.get(
			'https://pokeapi.co/api/v2/pokedex/national'
		);

		const [dataUser, dataPokemon] = await Promise.all([
			responseUser,
			responsePokemon
		]);

		const user = dataUser.data;
		const totalPokemon = dataPokemon.data.pokemon_entries.length;

		const pokemonDetails = await Promise.all(
			user.pokedex.map(async (pokemonName: string) => {
				try {
					const responsePokemonDetail = await axios.get(
						`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
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
					console.error(
						`Error fetching Pokémon details for ${pokemonName}`
					);
					return null;
				}
			})
		);

		const filteredPokemonData = pokemonDetails.filter(
			pokemon => pokemon !== null
		);

		const sortedPokemonData = [...filteredPokemonData].sort(
			(pokemonA, pokemonB) => parseInt(pokemonA.id) - parseInt(pokemonB.id)
		);

		return {
			props: {
				user,
				avatar,
				totalPokemon,
				pokemonData: sortedPokemonData
			}
		};
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return {
				props: {
					user: [],
					avatar: '',
					totalPokemon: 0,
					pokemonIDs: []
				}
			};
		}
	}
}

interface UserData {
	id: string;
	username: string;
	email: string;
	password: string;
	pokedex: Array<string>;
	createdAt: string;
	updateAt: string;
}

interface PokemonData {
	id: string;
	name: string;
	types: string[];
	sprite: string;
}

interface TypeInfo {
	type: {
		name: string;
	};
}

const Profile = ({
	user,
	avatar,
	totalPokemon,
	pokemonData
}: {
	user: UserData;
	avatar: string;
	totalPokemon: number;
	pokemonData: PokemonData[];
}) => {
	const [userData, setUserData] = useState(user);
	const pokedexCompletion =
		userData.pokedex && totalPokemon > 0
			? ((userData.pokedex.length / totalPokemon) * 100).toFixed(2)
			: 0;

	console.log(userData);
	function formatDateToFrench(dateString: string): string {
		const date = new Date(dateString);
		const options: Intl.DateTimeFormatOptions = {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
		};

		return date.toLocaleDateString('fr-FR', options);
	}

	return (
		<>
			{Object.keys(userData).length === 0 ? (
				<div>Chargement...</div>
			) : (
				<section className="profil">
					<div className="profil-infos">
						<div className="user-infos">
							<div className="user-img">
								<Image
									src={avatar}
									alt="Avatar profile"
									priority
									width={250}
									height={250}
								/>
							</div>
							<div className="user-details">
								<div className="user-account">
									<div className="user-username">
										<h1>{userData.username}</h1>
									</div>

									<span>
										Compte créé le{' '}
										{formatDateToFrench(userData.createdAt)}
									</span>
								</div>

								<ul>
									<li>
										<FaEnvelope />
										<span className="user-email">
											{userData.email}
										</span>
									</li>
								</ul>
							</div>
							<div className="user-edition">
								<button type="submit" className="user-update">
									<FaPencil />
									<span>Modifier </span>
								</button>
								<button type="submit" className="user-delete">
									<FaTrashCan />
									<span>Supprimer </span>
								</button>
							</div>
						</div>
						<div className="underline profile"></div>
						<div className="user-pokedex">
							<div className="pokedex-title">
								<h1>Pokédex</h1>
								<div className="progress-bar">
									<div
										className="progress"
										style={{ width: `${pokedexCompletion}%` }}
									></div>
									<span className="completion-text">
										{userData.pokedex.length} Pokémon sur{' '}
										{totalPokemon} ({pokedexCompletion} %)
									</span>
								</div>
							</div>

							<div className="pokedex-cards">
								{pokemonData.map(pokemon => (
									<PokedexCard
										pokemon={pokemon}
										key={pokemon.id}
									></PokedexCard>
								))}
							</div>
						</div>
					</div>
				</section>
			)}
		</>
	);
};

export default Profile;
