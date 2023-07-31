import React, { useEffect, useState } from 'react';
import axios, { Axios, AxiosResponse } from 'axios';
import { faker } from '@faker-js/faker';
import { FaEnvelope, FaPencil } from 'react-icons/fa6';

export async function getServerSideProps() {
	const avatar = faker.image.avatarGitHub();

	const jwtToken =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzM2OGFhNzAyZTUyMjE4NWQ0OGUxZSIsInVzZXJuYW1lIjoiTHVmZnlzb25pYyIsImVtYWlsIjoicmlja3lAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkVG9IZUQ4ZUtvMUJ3NFBnaEIyMGExLjR3amJZUFNmZWlsS3NTaFdjRi9hUFQ5d3RFa3FaalciLCJwb2tlZGV4IjpbInBpa2FjaHUiLCJyaW9sdSIsImx1Y2FyaW8iLCJ2aWN0aW5pIl0sImNyZWF0ZWRBdCI6IjIwMjMtMDctMjhUMDc6MDU6MTMuOTU3WiIsInVwZGF0ZUF0IjoiMjAyMy0wNy0zMVQxMTo0NTozMi40MDdaIiwiaWF0IjoxNjkwODA0OTczLCJleHAiOjE2OTA4MDU1NzN9.4sAMci-jHpKw2HY3HP3N1OSEqcqsN2iuCft1Kx7iMXw';

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

		return {
			props: {
				user,
				avatar,
				totalPokemon
			}
		};
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return {
				props: {
					user: [],
					avatar: '',
					totalPokemon: 0
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

const Profile = ({
	user,
	avatar,
	totalPokemon
}: {
	user: UserData;
	avatar: string;
	totalPokemon: number;
}) => {
	const [userData, setUserData] = useState(user);
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

	return (
		<>
			{/* Informations générales de l'utilisateur */}
			{Object.keys(userData).length === 0 ? (
				<div>Chargement...</div>
			) : (
				<section className="profil">
					<div className="user-infos">
						<div className="user-img">
							<img src={avatar} alt="Avatar profile" />
						</div>
						<div className="user-details">
							<h1>{userData.username}</h1>
							<ul>
								<li>
									<FaEnvelope />
									<span className="user-email">{userData.email}</span>
								</li>
							</ul>
							<span>
								Compte créé le {formatDateToFrench(userData.createdAt)}
							</span>
						</div>
						<div className="user-edition">
							<button type="submit">
								<FaPencil />
								<span>Modifier le compte</span>
							</button>
						</div>
					</div>
					<div className="user-pokedex">
						<h1>Pokédex</h1>
						<span className="user-pokedex-subtitle">
							{userData.pokedex.length} Pokémon sur {totalPokemon} (
							{pokedexCompletion} %)
						</span>
						<div>
							{userData.pokedex.map(pokemon => (
								<div key={pokemon}>{pokemon}</div>
							))}
						</div>
					</div>
				</section>
				// <section>
				// 	<h1>Profil d'utilisateur</h1>
				// 	<div className="profileContainer">
				// 		<h1 className="trainerName">Pseudo : {data.username}</h1>
				// 		<h1 className="trainerEmail">Email : {data.email}</h1>

				// 		<div className="progressBar">
				// 			<div
				// 				className="progress"
				// 				style={{ width: `${progression}%` }}
				// 			></div>
				// 		</div>

				// 		<p className="progressLabel">
				// 			Progression du pokédex : {progression}%
				// 		</p>
				// 	</div>

				// 	{/* Pokédex de l'utilisateur */}
				// 	<div className="pokemonList">
				// 		{data.pokedex.map(pokemon => (
				// 			<div key={pokemon} className="pokemonCard">
				// 				<p className="pokemonName">{pokemon}</p>
				// 			</div>
				// 		))}
				// 	</div>
				// </section>
			)}
		</>
	);
};

export default Profile;
