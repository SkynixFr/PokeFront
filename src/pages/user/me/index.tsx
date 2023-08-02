import React, { useState } from 'react';
import axios from 'axios';

import { faker } from '@faker-js/faker';
import { FaEnvelope, FaPencil, FaTrashCan } from 'react-icons/fa6';
import Image from 'next/image';
import PokedexCard from '../../../components/pokedexCard';
import profileTitle from '../../../public/images/profil-title.png';
import blancoton from '../../../public/images/blancoton.png';
import blancotonShiny from '../../../public/images/blancoton-shiny.png';
import { GetServerSidePropsContext } from 'next';
import { setGlobalContext } from '../../../services/axiosInterceptor';
import axiosInstance from '../../../services/axiosInterceptor';
import Cookies from 'js-cookie';
import axiosInstancePublic from '../../../services/axiosInstancePublic';
import { useRouter } from 'next/router';

const accessToken = Cookies.get('acessToken');

const headers = {
	Authorization: `Bearer ${accessToken}`,
	'Content-Type': 'application/json'
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const avatar = faker.image.avatarGitHub();

	const jwtToken =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzM2OGFhNzAyZTUyMjE4NWQ0OGUxZSIsInVzZXJuYW1lIjoiTHVmZnlzb25pYyIsImVtYWlsIjoicmlja3lAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkVG9IZUQ4ZUtvMUJ3NFBnaEIyMGExLjR3amJZUFNmZWlsS3NTaFdjRi9hUFQ5d3RFa3FaalciLCJwb2tlZGV4IjpbInBpa2FjaHUiLCJyaW9sdSIsImx1Y2FyaW8iLCJ2aWN0aW5pIiwibWV3IiwiZWV2ZWUiXSwiY3JlYXRlZEF0IjoiMjAyMy0wNy0yOFQwNzowNToxMy45NTdaIiwidXBkYXRlQXQiOiIyMDIzLTA4LTAxVDA5OjQyOjA2LjU2OVoiLCJpYXQiOjE2OTA5NjE4OTgsImV4cCI6MTY5MDk2MjQ5OH0.XvkrzRqzmB2gvoHtolBA_Qz-2vtbaYQ1BBVYZhm-evo';

	const config = {
		headers: {
			Authorization: `Bearer ${jwtToken}`
		}
	};

	try {
		setGlobalContext(context);

		const responseUser = await axiosInstance.get('/users/me'); // Use the axiosInstance with the config

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
					return {
						props: {}
					};
				}
			})
		);

		const sortedPokemonData = [...pokemonDetails].sort(
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

interface UpdateBody {
	username?: string;
	email?: string;
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
	const [showDeleteMessage, setShowDeleteMessage] = useState(false);
	const [showDeletePopUp, setShowDeletePopUp] = useState(false);
	const [resultMessage, setResultMessage] = useState('');
	const [deleteMessage, setDeleteMessage] = useState('');
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [colorResultMessage, setColorResultMessage] = useState('');
	const [colorDeleteMessage, setColorDeleteMessage] = useState('');
	const [password, setPassword] = useState('');

	const router = useRouter();

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

	function isValidEmail(email: string): boolean {
		const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return emailPattern.test(email);
	}

	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		const inputId = event.target.id;

		if (inputId === 'username') {
			setUsername(event.target.value);
		} else if (inputId === 'email') {
			setEmail(event.target.value);
		}
		if (inputId === 'password') {
			setPassword(event.target.value);
		}
	}

	function sleep(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	const handleEditClick = () => {
		setShowPopup(true);
	};

	const handleDeleteClick = () => {
		setShowDeletePopUp(true);
	};

	const handlePopupClose = () => {
		setShowResultMessage(false);
		setShowPopup(false);
	};

	const handleDeletePopupClose = () => {
		setShowDeleteMessage(false);
		setShowDeletePopUp(false);
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		// Appel PokePI pour modification de l'utilisateur
		try {
			const body: UpdateBody = { username: '', email: '' };
			const bodyData = {
				data: username,
				password: password
			};
			if (username.trim() === '') {
				delete body.username;
			} else body.username = username;

			if (email.trim() === '') {
				delete body.email;
			} else body.email = email;

			const responseFirstLogin = await axios.post(
				'http://localhost:8080/api/v2/users/login',
				{ data: userData.username, password: password }
			);
			if (responseFirstLogin.status != 200) {
				throw new Error('Not the same password');
			}
			const responseUpdateUser = await axiosInstancePublic.put(
				`users/${user.id}`,
				body,
				{
					headers: headers
				}
			);

			setShowResultMessage(true);

			sleep(3000);

			// Fermer la pop-up après la soumission
			setShowPopup(false);
			setShowResultMessage(false);
			if (responseUpdateUser.status === 200) {
				const res = await axios.post(
					'http://localhost:8080/api/v2/users/login',
					bodyData
				);
				const accessToken = res.data.accessToken;
				// Le cookies de l'accessToken expire dans 10 min max
				Cookies.set('accessToken', accessToken, {
					expires: 10 / (24 * 60)
				});
				const refreshToken = res.data.refreshToken;
				//le cookie du refreshToken s'expire dans 1 jour
				Cookies.set('refreshToken', refreshToken, {
					expires: 1
				});

				window.location.reload();
			}
		} catch (error) {
			// console.error(`Error while updating user ${user.username}`);
			// console.log('Erreur : ', error);
			setColorResultMessage(`red`);
			setResultMessage(`Erreur lors de la modification de vos informations`);

			setShowResultMessage(true);
		}
	};

	const handleDelete = async (event: React.FormEvent) => {
		event.preventDefault();

		// Appel PokePI pour suppression de l'utilisateur
		try {
			const responseUpdateUser = await axiosInstancePublic.delete(
				`users/${user.id}`,
				{
					headers: headers
				}
			);

			console.log(responseUpdateUser);

			setColorDeleteMessage(`green`);
			setDeleteMessage(`Compte supprimé avec succès !`);

			setShowDeleteMessage(true);

			sleep(3000);

			// Fermer la pop-up après la confirmation
			setShowPopup(false);
			setShowResultMessage(false);

			if (responseUpdateUser.status === 200) {
				Cookies.remove('refreshToken');
				Cookies.remove('accessToken');
				router.push('../../login');
			}
		} catch (error) {
			console.error(
				`Erreur lors de la suppression du compte de l'utilisateur : ${user.username}`
			);
			console.log('Erreur : ', error);

			setColorDeleteMessage(`red`);
			setDeleteMessage(`Erreur lors de la suppression de votre compte`);

			setShowDeleteMessage(true);
		}
	};

	return (
		<>
			{Object.keys(userData).length === 0 ? (
				<div>Chargement...</div>
			) : (
				<section className="profil">
					<div className="blancoton">
						<Image src={blancoton} alt="blancoton logo" priority></Image>
					</div>
					<div className="blancoton">
						<Image src={blancoton} alt="blancoton logo" priority></Image>
					</div>
					<div className="blancoton">
						<Image
							src={blancotonShiny}
							alt="blancotonShiny logo"
							priority
						></Image>
					</div>
					<div className="blancoton">
						<Image src={blancoton} alt="blancoton logo" priority></Image>
					</div>
					<div className="blancoton">
						<Image src={blancoton} alt="blancoton logo" priority></Image>
					</div>
					<div className="blancoton">
						<Image
							src={blancotonShiny}
							alt="blancotonShiny logo"
							priority
						></Image>
					</div>
					<div className="blancoton">
						<Image src={blancoton} alt="blancoton logo" priority></Image>
					</div>
					<div className="blancoton">
						<Image src={blancoton} alt="blancoton logo" priority></Image>
					</div>
					<div className="profil-title">
						<Image src={profileTitle} alt="Profil title" priority></Image>
					</div>
					<div className="profil-infos">
						<div className="user-infos-container">
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
									<button
										type="submit"
										className="user-update"
										onClick={handleEditClick}
									>
										<FaPencil />
										<span>Modifier </span>
									</button>
									<button
										type="submit"
										className="user-delete"
										onClick={handleDeleteClick}
									>
										<FaTrashCan />
										<span>Supprimer </span>
									</button>
								</div>

								{showPopup && (
									<div className="popup">
										<div className="popup-content">
											{/* Formulaire de modification des informations de l'utilisateur */}
											<h1 className="form-title">
												Modifier vos informations
											</h1>
											<form
												onSubmit={handleSubmit}
												className="form-fields"
											>
												<div className="form-group">
													<label
														htmlFor="username"
														className="form-label"
													>
														Pseudo :{' '}
													</label>
													<input
														type="text"
														id="username"
														placeholder="Nouveau pseudo"
														onChange={handleChange}
													/>
												</div>

												<div className="form-group">
													<label htmlFor="email">Email : </label>
													<input
														type="email"
														id="email"
														placeholder="Nouvel email"
														onChange={handleChange}
													/>
												</div>
												<div className="form-group">
													<label htmlFor="mot de passe">
														Mot de passe :{' '}
													</label>
													<input
														type="password"
														id="password"
														placeholder="Mot de passe actuel"
														onChange={handleChange}
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

												<button
													type="submit"
													className="submit-button"
												>
													Modifier
												</button>
												<button
													type="button"
													onClick={handlePopupClose}
													className="cancel-button"
												>
													Annuler
												</button>
											</form>
										</div>
									</div>
								)}

								{showDeletePopUp && (
									<div className="popup">
										<div className="popup-content">
											{/* Pop up validation suppression de compte */}
											<h1 className="form-title">
												Êtes-vous sûr de vouloir supprimer votre
												compte ?
											</h1>
											<form onSubmit={handleDelete}>
												{showDeleteMessage && (
													<div
														className="field-result"
														style={{ color: colorDeleteMessage }}
													>
														{deleteMessage}
													</div>
												)}

												<button
													type="submit"
													className="submit-button"
												>
													Confirmer la suppression
												</button>
												<button
													type="button"
													onClick={handleDeletePopupClose}
													className="cancel-button"
												>
													Annuler
												</button>
											</form>
										</div>
									</div>
								)}
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
