import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ContenuPokedex from './ContenuPokedex';

const numberRequetsType = 21;
const numberRequetsPic = 2;

export default function AxiosRequetsPokedex() {
	const [dataName, setDataName] = useState([]);
	const [dataType, setDataType] = useState([]);
	const [dataPic, setDataPic] = useState([]);

	// REQUETE ACQUISITION DES NOMS
	const getDataName = () => {
		let config = {
			method: 'get',
			maxBodyLength: Infinity,
			url: 'https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0'
		};

		axios
			.request(config)
			.then(response => {
				console.log('data name : ', response.data.results);
				setDataName(response.data.results);
			})
			.catch(error => {
				console.log(error);
			});
	};

	// REQUETE ACQUISITION DES TYPES
	const getDataType = () => {
		for (let indexType = 1; indexType < numberRequetsType; indexType++) {
			let config = {
				method: 'get',
				maxBodyLength: Infinity,
				url: 'https://pokeapi.co/api/v2/pokemon/' + indexType + '/'
			};

			axios
				.request(config)
				.then(response => {
					console.log('data type : ', response.data.types);
					setDataType(response.data.types);
				})
				.catch(error => {
					console.log(error);
				});
		}
	};

	// REQUETE ACQUISITION DES IMAGES
	const getDataPic = () => {
		for (let indexPic = 1; indexPic < numberRequetsPic; indexPic++) {
			let config = {
				method: 'get',
				maxBodyLength: Infinity,
				url:
					'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' +
					indexPic +
					'.png'
			};

			axios
				.request(config)
				.then(response => {
					console.log('data pic : ', response.data);
					setDataPic(response.data);
				})
				.catch(error => {
					console.log(error);
				});
		}
	};

	useEffect(() => {
		getDataName();
		getDataType();
		getDataPic();
	}, []);

	return (
		<>
			<h3>Liste des pokémons provenant de PokéAPI</h3>
			{dataName.map(todo => (
				<ContenuPokedex key={todo.name} todo={todo} />
			))}
		</>
	);
}

//  Nom : https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0
// exemple  | https://pokeapi.co/api/v2/pokemon/1/

//  Type : https://pokeapi.co/api/v2/pokemon/{id or name}/
// exemple  | https://pokeapi.co/api/v2/pokemon/1/ in types.type.name

//  Image : https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png
// https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png

// pagination : https://pokeapi.co/api/v2/{endpoint}/
