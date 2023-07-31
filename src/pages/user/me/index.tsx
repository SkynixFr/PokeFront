import React, { useEffect, useState } from 'react';
import axios, { Axios, AxiosResponse } from 'axios';

export async function getServerSideProps() {
	const jwtToken =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzM2OGFhNzAyZTUyMjE4NWQ0OGUyMCIsInVzZXJuYW1lIjoiTmV3dCIsImVtYWlsIjoic2FyYW55dUBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRNYnl3UEZiWEZMLlowWk12SUZ0bGdPcU9vaVlZUVZicDF4aDBFdEh0cW5hTy8vaXp1T0EvTyIsInBva2VkZXgiOlsicGlrYWNodSIsInJpb2x1Il0sImNyZWF0ZWRBdCI6IjIwMjMtMDctMjhUMDc6MDU6MTQuNDA0WiIsInVwZGF0ZUF0IjoiMjAyMy0wNy0yOFQxMzoxMjo1OS4yNjNaIiwiaWF0IjoxNjkwNzk3MTIyLCJleHAiOjE2OTA3OTc3MjJ9.k7DkMP5XsiRKEJKgqqcjplF_Chut6Roftegwr8eA70k';

	const config = {
		headers: {
			Authorization: `Bearer ${jwtToken}`
		}
	};

	try {
		const res = await axios.get(
			'http://localhost:8080/api/v2/users/me',
			config
		);

		const data = res.data;

		return {
			props: {
				data
			}
		};
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return {
				props: {
					data: []
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

const Profile = ({ data }: { data: UserData }) => {
	const [userData, setUserData] = useState(data);

	console.log(data);
	const progression = 75;

	return (
		<>
			{/* Informations générales de l'utilisateur */}
			{Object.keys(userData).length === 0 ? (
				<div>Chargement...</div>
			) : (
				<section>
					<h1>Profil d'utilisateur</h1>
					<div className="profileContainer">
						<h1 className="trainerName">Pseudo : {data.username}</h1>
						<h1 className="trainerEmail">Email : {data.email}</h1>

						<div className="progressBar">
							<div
								className="progress"
								style={{ width: `${progression}%` }}
							></div>
						</div>

						<p className="progressLabel">
							Progression du pokédex : {progression}%
						</p>
					</div>

					{/* Pokédex de l'utilisateur */}
					<div className="pokemonList">
						{data.pokedex.map(pokemon => (
							<div key={pokemon} className="pokemonCard">
								<p className="pokemonName">{pokemon}</p>
							</div>
						))}
					</div>
				</section>
			)}
		</>
	);
};

export default Profile;
