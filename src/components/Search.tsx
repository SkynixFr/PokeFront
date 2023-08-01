import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { describe } from 'node:test';

export function Search() {
	const [datas, setdatas] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');

	const handleSearchTerm = e => {
		let value = e.target.value;
		setSearchTerm(value.toLowerCase());
	};

	console.log('searchterm ', searchTerm);

	useEffect(() => {
		fetch('https://pokeapi.co/api/v2/pokemon/' + { searchTerm })
			.then(response => response.json())
			.then(json => setdatas(json));

		// requete par type : https://pokeapi.co/api/v2/type/{id or name}/
	}, []);

	console.log('datas search ', datas);

	return (
		<>
			<div className="searchBar">
				<input
					type="text"
					name="searchBar"
					id="currentTextSearchBar"
					placeholder="Rechercher"
					onChange={handleSearchTerm}
				/>
				<button onChange={Search}>Valider</button>
			</div>
			<div className="search__result" key={datas.id}>
				<p> {datas.id} </p>
				<p> {datas.name} </p>
			</div>
		</>
	);
}

export default Search;

// <img src={datas.sprites.front_default} alt={datas.name}/>

// <p> Type : {datas.types[0].type.name} </p>
