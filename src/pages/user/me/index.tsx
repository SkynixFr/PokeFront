import React, { useEffect, useState } from 'react';
import axios, { Axios, AxiosResponse } from 'axios';
import { faker } from '@faker-js/faker';
import { FaEnvelope, FaPencil, FaTrashCan } from 'react-icons/fa6';
import Image from 'next/image';
import PokedexCard from '../../../components/pokedexCard';

const jwtToken =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzM2OGFhNzAyZTUyMjE4NWQ0OGUyMCIsInVzZXJuYW1lIjoiTmV3dCIsImVtYWlsIjoibmV3dEBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRNYnl3UEZiWEZMLlowWk12SUZ0bGdPcU9vaVlZUVZicDF4aDBFdEh0cW5hTy8vaXp1T0EvTyIsInBva2VkZXgiOlsicGlrYWNodSIsInJpb2x1IiwiZWV2ZWUiXSwiY3JlYXRlZEF0IjoiMjAyMy0wNy0yOFQwNzowNToxNC40MDRaIiwidXBkYXRlQXQiOiIyMDIzLTA4LTAxVDEzOjQwOjI1LjM0NFoiLCJpYXQiOjE2OTA4OTgwODUsImV4cCI6MTY5MDg5ODY4NX0.f2zBqsuSeylsp5uaDc62JcsYXCgAXUrbZiPUEf3biVQ';

const headers = {
	Authorization: `Bearer ${jwtToken}`,
	'Content-Type': 'application/json'
};

export async function getServerSideProps() {
	const avatar = faker.image.avatarGitHub();

	try {
		const responseUser = await axios.get(
			'http://localhost:8080/api/v2/users/me',
			{
				headers: headers
			}
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
					return {
						name: pokemonDetail.name,
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

		return {
			props: {
				user,
				avatar,
				totalPokemon,
				pokemonData: filteredPokemonData
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
	const [showPopup, setShowPopup] = useState(false);
	const [showResultMessage, setShowResultMessage] = useState(false);
	const [resultMessage, setResultMessage] = useState('');
	const [colorResultMessage, setColorResultMessage] = useState('');
	const pokedexCompletion =
		userData.pokedex && totalPokemon > 0
			? ((userData.pokedex.length / totalPokemon) * 100).toFixed(2)
			: 0;

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

	function sleep(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	const handleEditClick = () => {
		setShowPopup(true);
	};

	const handlePopupClose = () => {
		setShowPopup(false);
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		// Soumettre les informations modifiées ici (username, email, password)
		console.log('Username:', user.username);
		console.log('Email:', user.email);
		console.log('Password:', user.password);

		// Appel PokePI pour modification de l'utilisateur
		try {
			const username = document.getElementById('username').value;
			console.log('username = ', username);

			const body = {
				// Les données que vous souhaitez envoyer dans le corps de la requête
				// Par exemple, si vous voulez envoyer un objet avec des propriétés username, email et password :
				username: username
				// email: 'nouveauEmail@example.com',
				// password: 'nouveauMotDePasse'
			};

			console.log('datas : ', headers, body);

			const responseUpdateUser = await axios.put(
				`http://localhost:8080/api/v2/users/${user.id}`,
				{
					headers: headers,
					data: body
				}
			);

			console.log(responseUpdateUser);

			setColorResultMessage(`green`);
			setResultMessage(`Modification effectuée avec succès !`);

			// return true;
		} catch (error) {
			console.error(`Error while updating user ${user.username}`);
			setColorResultMessage(`red`);
			setResultMessage(`Erreur lors de la modification de vos informations`);
		} finally {
			console.log('Je suis dans le finally');
			console.log(resultMessage);
			setShowResultMessage(true);

			await sleep(5000);

			// Fermer la pop-up après la soumission
			// setShowPopup(false);
			setShowResultMessage(false);
		}
	};

	return (
		<>
			{/* Informations générales de l'utilisateur */}
			{Object.keys(userData).length === 0 ? (
				<div>Chargement...</div>
			) : (
				<section className="profil">
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
									<span className="user-email">{userData.email}</span>
								</li>
							</ul>
						</div>
						<div className="user-edition">
							<button
								type="submit"
								className="user-update"
								onClick={handleEditClick}
							>
								<FaPencil />
								<span>Modifier </span>
							</button>
							<button type="submit" className="user-delete">
								<FaTrashCan />
								<span>Supprimer </span>
							</button>
						</div>
						{showPopup && (
							<div className="popup">
								<div className="popup-content">
									{/* Formulaire de modification des informations de l'utilisateur */}
									<h2>Modifier vos informations</h2>
									<form onSubmit={handleSubmit}>
										<div className="form-group">
											<label htmlFor="username">Pseudo : </label>
											<input
												type="text"
												id="username"
												//value={user.username}
												onChange={() => {}}
												// onChange={e =>
												// 	(user.username = e.target.value)
												// }
											/>
										</div>

										<div className="form-group">
											<label htmlFor="email">Email : </label>
											<input
												type="email"
												id="email"
												value={user.email}
												onChange={() => {}}
												// onChange={e =>
												// 	(user.email = e.target.value)
												// }
											/>
										</div>

										{showResultMessage && (
											<div
												className="field-result"
												style={{ color: colorResultMessage }}
											>
												{resultMessage}
											</div>
										)}

										<button type="submit">Soumettre</button>
										<button type="button" onClick={handlePopupClose}>
											Annuler
										</button>
									</form>
								</div>
							</div>
						)}
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
									{userData.pokedex.length} Pokémon sur {totalPokemon}{' '}
									({pokedexCompletion} %)
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
				</section>
			)}
		</>
	);
};

export default Profile;
