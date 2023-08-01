import Image from 'next/image';

interface PokemonData {
	id: string;
	name: string;
	types: string[];
	sprite: string;
}

interface PokedexCardProps {
	pokemon: PokemonData;
}

const PokedexCard: React.FC<PokedexCardProps> = ({ pokemon }) => {
	return (
		<div className="pokedex-card">
			<p className="card-id">#{pokemon.id}</p>
			<div className="card-sprite">
				<Image
					src={pokemon.sprite}
					alt={`${pokemon.name} sprite`}
					priority
					width={250}
					height={250}
				/>
			</div>
			<div className="card-name">
				<h1>{pokemon.name}</h1>
			</div>

			<p>{pokemon.types.join(', ')}</p>
		</div>
	);
};

export default PokedexCard;
