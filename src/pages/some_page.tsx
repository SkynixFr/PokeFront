// import React from 'react';
import axiosInstance from '../services/axiosInstance';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { faker } from '@faker-js/faker';
import { FaEnvelope, FaPencil } from 'react-icons/fa6';

import { GetServerSidePropsContext } from 'next';
import { setGlobalContext } from '../services/axiosInterceptor';

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const avatar = faker.image.avatarGitHub();
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
			)}
		</>
	);
};

export default Profile;
