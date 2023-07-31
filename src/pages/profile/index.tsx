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
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzM2OGFhNzAyZTUyMjE4NWQ0OGUyMCIsInVzZXJuYW1lIjoiTmV3dCIsImVtYWlsIjoic2FyYW55dUBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRNYnl3UEZiWEZMLlowWk12SUZ0bGdPcU9vaVlZUVZicDF4aDBFdEh0cW5hTy8vaXp1T0EvTyIsInBva2VkZXgiOlsicGlrYWNodSIsInJpb2x1Il0sImNyZWF0ZWRBdCI6IjIwMjMtMDctMjhUMDc6MDU6MTQuNDA0WiIsInVwZGF0ZUF0IjoiMjAyMy0wNy0yOFQxMzoxMjo1OS4yNjNaIiwiaWF0IjoxNjkwNzQ0NzE3LCJleHAiOjE2OTA3NDUzMTd9.VsGM-0vbTpPvTNn3ReihY9ycsKdcNPwPnKUOzfSdXus';
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
	const trainerPokedex = userData?.pokedex || [];
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
				{/* <p className={styles.trainerLevel}>
					Niveau de dresseur : {trainerLevel}
				</p> */}

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

			<div className={styles.pokemonList}>
				{trainerPokedex.map(item => (
					<div key={item} className={styles.pokemonCard}>
						<p className={styles.pokemonName}>{item}</p>
					</div>
				))}
			</div>
		</>
	);
};

export default Profil;
