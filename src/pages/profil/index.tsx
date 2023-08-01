import React, { useEffect, useState } from 'react';
import styles from './Profile.module.css';
import axios, { AxiosResponse } from 'axios';
//import PokemonList from '../../components/pokemonList';

interface UserData {
	id: string;
	username: string;
	email: string;
	password: string;
	pokedex: Array<string>;
	createdAt: string;
	updateAt: string;
}

const Profil: React.FC = () => {
	const [userData, setUserData] = useState<UserData | null>(null);

	useEffect(() => {
		const jwtToken =
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzM2OGFhNzAyZTUyMjE4NWQ0OGUxZSIsInVzZXJuYW1lIjoiTHVmZnlzb25pYyIsImVtYWlsIjoicmlja3lAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkeUFhQndmYzVPYVVrOU84TG1CTXprZWlubW14OC9aTmpwSW1UcnkvbEI3SVVVLnBNMloucksiLCJwb2tlZGV4IjpbInBpa2FjaHUiLCJyaW9sdSJdLCJjcmVhdGVkQXQiOiIyMDIzLTA3LTI4VDA3OjA1OjEzLjk1N1oiLCJ1cGRhdGVBdCI6IjIwMjMtMDctMjhUMTM6MTU6MzYuOTU2WiIsImlhdCI6MTY5MDU1NTY5MiwiZXhwIjoxNjkwNTU2MjkyfQ.j7j8P9l6PmCSNLt8rBAN7LkmLWAE2XE24GT3Bt3cYbs';
		localStorage.setItem('jwtToken', jwtToken);

		const config = {
			headers: {
				Authorization: `Bearer ${jwtToken}`
			}
		};

		const fetchUserData = async () => {
			try {
				const response = await axios.get<UserData>(
					'http://localhost:8080/api/v2/users/me',
					config
				);

				setUserData(response.data);
			} catch (error) {
				console.error(
					'Erreur lors de la récupération des données utilisateur :',
					error
				);
			}
		};

		fetchUserData();
		console.log(userData);
	}, []);

	const trainerName = userData?.username;
	const trainerEmail = userData?.email;
	const trainerPokedex = userData?.pokedex;
	const trainerLevel = 50;
	const progression = 75;

	if (!userData) {
		// Afficher un indicateur de chargement pendant que les données sont récupérées
		return <div>Chargement...</div>;
	}

	return (
		<>
			<h1>Profil d'utilisateur</h1>
			<div className={styles.profileContainer}>
				<h1 className={styles.trainerName}>Pseudo : {trainerName}</h1>
				<h1 className={styles.trainerName}>Email : {trainerEmail}</h1>
				<p className={styles.trainerLevel}>
					Niveau de dresseur : {trainerLevel}
				</p>

				<div className={styles.progressBar}>
					<div
						className={styles.progress}
						style={{ width: `${progression}%` }}
					></div>
				</div>

				<p className={styles.progressLabel}>
					Progression vers le prochain niveau : {progression}%
				</p>

				{/* Le reste du contenu du profil Pokémon */}
			</div>

			<div className="pokemon-list">
				{/* {trainerPokedex.map(item => (
					<div key={item} className="pokemon-card">
						<p className="pokemon-name">{item}</p>
					</div>
				))} */}
			</div>
		</>
	);
};

export default Profil;
