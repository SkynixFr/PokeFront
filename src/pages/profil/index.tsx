import React, { useEffect, useState } from 'react';
import styles from './Profile.module.css';
import axios from 'axios';
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
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzM2OGFhNzAyZTUyMjE4NWQ0OGUxZSIsInVzZXJuYW1lIjoiTHVmZnlzb25pYyIsImVtYWlsIjoicmlja3lAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkVG9IZUQ4ZUtvMUJ3NFBnaEIyMGExLjR3amJZUFNmZWlsS3NTaFdjRi9hUFQ5d3RFa3FaalciLCJwb2tlZGV4IjpbInBpa2FjaHUiLCJyaW9sdSIsImx1Y2FyaW8iLCJ2aWN0aW5pIiwibWV3IiwiZWV2ZWUiXSwiY3JlYXRlZEF0IjoiMjAyMy0wNy0yOFQwNzowNToxMy45NTdaIiwidXBkYXRlQXQiOiIyMDIzLTA4LTAxVDA5OjQyOjA2LjU2OVoiLCJpYXQiOjE2OTA4ODkxOTMsImV4cCI6MTY5MDg4OTc5M30.E9y_7_B8PS8fzeW5mh8cegQfK00d35jgnYIdaew__WE';
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
