import React from 'react';
import { Pokemon } from '../pages/pokedex/interface';
import PokemonList from './PokemonList';
// import './pokemon.css';

interface Props {
	pokemons: Pokemon[];
}

const PokemonCollection: React.FC<Props> = props => {
	const { pokemons } = props;

	return (
		<>
			<section className="collection-container">
				{pokemons.map(pokemon => {
					return (
						<PokemonList
							key={pokemon.id}
							name={pokemon.name}
							id={pokemon.id}
							image={pokemon.sprites.front_default}
							type={pokemon.types[0].type.name}
						/>
					);
				})}
			</section>
		</>
	);
};

export default PokemonCollection;
