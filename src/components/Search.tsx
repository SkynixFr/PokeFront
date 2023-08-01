import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { describe } from 'node:test'


export function Search() {

    const [data, setData] = useState([])

    useEffect(() => {

        // const response = await axios.get(
		// 	'https://pokeapi.co/api/v2/pokemon/pikachu'
		// );

		// const data = response.data;

        fetch('https://pokeapi.co/api/v2/pokemon/pikachu')
        .then((response) => response.json())
        .then((json) => setData(json));

        // requete par type : https://pokeapi.co/api/v2/type/{id or name}/
    }, [])

    console.log('data search ', data)

    return (
        <>
            <div className='searchBar'>
                <input type="text" name="searchBar" id="searchBar" placeholder="Rechercher" />
                
            </div>
            <div className='search__result' key={data.id}> 
                <p> # {data.id} </p>
				<p> {data.name} </p>
            </div>
        </>
        
    )
}

export default Search

// <img src={data.sprites.front_default} alt={data.name}/> 

// <p> Type : {data.types[0].type.name} </p>
