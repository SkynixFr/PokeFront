import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AxiosRequets from '../../components/AxiosRequets';

// const token =
// 	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYWlsQ2xpZW50IjoibWF4aW1lOTMxMUBvdWx0bG9vay5jb20iLCJtZHBDbGllbnQiOiIkMmIkMTAkTlk3SnBRa1Q1WTk5Tmx0TE1UMS5aT2ovWmVUdDIxeWs2R1lHRVVNeUNxZWV4Lm5VeU9xeG0iLCJpYXQiOjE2OTAzODUwNjMsImV4cCI6MTY5MDM4ODY2M30.BCJONCTa9K8-9Zs7ao_PmIsTVXjD2811Jhf4UbZA9yU';
// function FetchData() {
// 	const [data, setData] = useState([]);
// 	const getData = () => {
// 		let config = {
// 			method: 'get',
// 			maxBodyLength: Infinity,
// 			url: 'http://localhost:8080/api/v1/client/pokedex/pokemons',
// 			headers: {
// 				'x-access-token': token
// 			}
// 		};
// 		axios
// 			.request(config)
// 			.then(response => {
// 				// console.log(response.data);
// 				setData(response.data);
// 				console.log('mes données : ', response.data);
// 				console.log('type of : ', typeof response.data);
// 			})
// 			.catch(error => {
// 				console.log(error);
// 			});
// 	};

// 	useEffect(() => {
// 		getData();
// 	}, []);

// 	return <div>Axios</div>;
// }

export default AxiosRequets;
