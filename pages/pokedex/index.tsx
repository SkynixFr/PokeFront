// 'use client';
// import { useState, useEffect } from 'react';
// import MyForm from '../../components/MyForm';

// const pokédex = () => {
// 	const recherher = () => {};

// 	const myform = MyForm();

// 	return (
// 		<>
// 			<h1>Voici les pokémons d'un ton pokédex </h1>
// 			<div>{myform} </div>
// 		</>
// 	);
// };

// export default pokédex;

'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FetchData from '../../components/AxiosRequets';

// http://localhost:8080/api/v1/pokemon

const pokédex = () => {
	// const [data, setData] = useState(null);
	// const [loading, setLoading] = useState(true);
	// const [records, setRecords] = useState([]);
	// const token =
	// 	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYWlsQ2xpZW50IjoibWF4aW1lOTMxMUBvdWx0bG9vay5jb20iLCJtZHBDbGllbnQiOiIkMmIkMTAkTlk3SnBRa1Q1WTk5Tmx0TE1UMS5aT2ovWmVUdDIxeWs2R1lHRVVNeUNxZWV4Lm5VeU9xeG0iLCJpYXQiOjE2OTAzNzM1ODUsImV4cCI6MTY5MDM3NzE4NX0.9MYmuUOsp0Oe_FzTh8Fj88ZplZ0-8lxHJnC1ifoNBm4';

	// // useEffect : au chargement de la page
	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		let data = '';
	// 		let config = {
	// 			method: 'get',
	// 			maxBodyLength: Infinity,
	// 			url: 'http://localhost:8080/api/v1/client/pokedex/pokemons',
	// 			headers: {
	// 				'x-access-token': token
	// 			},
	// 			data: data
	// 		};
	// 		axios
	// 			.request(config)
	// 			.then(response => {
	// 				console.log(JSON.stringify(response.data));
	// 				setLoading(false);
	// 			})
	// 			.catch(error => {
	// 				console.log(error);
	// 				setLoading(false);
	// 			});
	// 	};

	// 	fetchData();

	// }, []);

	// return (
	// 	<div>
	// 		{loading ? (
	// 			<p>chargement...</p>
	// 		) : (
	// 			<div>
	// 				<h1>Les pokémons de ton pokédex</h1>
	// 				<div></div>
	// 			</div>
	// 		)}
	// 	</div>
	// );
	return <FetchData />;
};
export default pokédex;
