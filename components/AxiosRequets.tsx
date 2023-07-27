import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Contenu from './Contenu';

const token =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYWlsQ2xpZW50IjoibWF4aW1lOTMxMUBvdWx0bG9vay5jb20iLCJtZHBDbGllbnQiOiIkMmIkMTAkTlk3SnBRa1Q1WTk5Tmx0TE1UMS5aT2ovWmVUdDIxeWs2R1lHRVVNeUNxZWV4Lm5VeU9xeG0iLCJpYXQiOjE2OTA0NjE0ODMsImV4cCI6MTY5MDQ2NTA4M30.l8Eoe9acgOgitTYoZak3leYiCB4eKD6meO5RqFITHfo';
export default function AxiosRequets() {
	// Stocker la data de la web API  dans le state
	const [data, setData] = useState([]);
	var [mydata, setMyData] = useState([]);

	// requete de d'acquisition des données
	const getData = () => {
		let config = {
			method: 'get',
			maxBodyLength: Infinity,
			url: 'http://localhost:8080/api/v1/client/pokedex/pokemons',
			headers: {
				'x-access-token': token
			}
		};
		axios
			.request(config)
			.then(response => {
				setData(response.data);
				setMyData(response.data.Pokemons);
				mydata = response.data.Pokemons;
				console.log('mydata : ', mydata);
			})
			.catch(error => {
				console.log(error);
			});
	};

	useEffect(() => {
		getData();
	}, []);

	return (
		<>
			<h4>Nom des pokémons</h4>
			{mydata.map(todo => (
				<Contenu key={todo.Pokedex.nomPokemon} todo={todo} />
			))}
		</>
	);
}

// lien de vidéo intérresante :
// 		- https://www.youtube.com/watch?v=MISni97F2XA (6m38s)
// 		- https://www.youtube.com/watch?v=xniVQNpdiNY

// aide afficher des valeurs à ppartir d'un fichier JSON :
//		- https://openclassrooms.com/forum/sujet/afficher-des-valeurs-a-partir-dun-fichier-json
