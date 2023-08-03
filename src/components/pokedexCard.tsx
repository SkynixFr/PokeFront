import Image from 'next/image';

interface PokemonData {
	id: string;
	name: string;
	types: string[];
	sprite: string;
}

interface PokedexCardProps {
	pokemon: PokemonData;
	useCustomFont?: boolean;
}

const PokedexCard: React.FC<PokedexCardProps> = ({
	pokemon,
	useCustomFont
}) => {
	const typeClassNames = pokemon.types
		.map(type => `type-${type.toLowerCase()}`)
		.join(' ');

	const gradientColors = pokemon.types.map(type => {
		switch (type.toLowerCase()) {
			case 'grass':
				return ['#70c151', '#74cb48', '#78d33f'];
			case 'fire':
				return ['#F57D31', '#F59E54', '#F7C289'];
			case 'bug':
				return ['#7d8d21', '#a7b723', '#ccd554'];
			case 'dark':
				return ['#504039', '#75574C', '#9a807c'];
			case 'dragon':
				return ['#3f1f99', '#7037FF', '#975bcc'];
			case 'electric':
				return ['#f6bb2d', '#f9cf30', '#fce747'];
			case 'fairy':
				return ['#d68c99', '#e69eac', '#f4bfc3'];
			case 'fighting':
				return ['#a21c31', '#c12239', '#d53951'];
			case 'flying':
				return ['#827ebd', '#a891EC', '#C0ABE5'];
			case 'ghost':
				return ['#54467f', '#70559B', '#8b6fba'];
			case 'normal':
				return ['#8e8b6e', '#AAA67F', '#C3BF90'];
			case 'ground':
				return ['#c0a052', '#DEC16B', '#f3da86'];
			case 'ice':
				return ['#74c2cc', '#9AD6DF', '#beddee'];
			case 'poison':
				return ['#8f2483', '#A43E9E', '#b364b2'];
			case 'psychic':
				return ['#ff4a6a', '#FB5584', '#ff79a1'];
			case 'rock':
				return ['#8c8021', '#B69E31', '#d0c06b'];
			case 'steel':
				return ['#b6b8d9', '#B7B9D0', '#c8cadf'];
			case 'water':
				return ['#437dbf', '#6493EB', '#84ade7'];
			default:
				return '#fff';
		}
	});

	const gradientStyle =
		pokemon.types.length > 1
			? {
					background: `linear-gradient(to left, ${gradientColors.join(
						','
					)})`
			  }
			: { background: gradientColors[0][1] };

	return (
		<div className={`pokedex-card ${typeClassNames}`} style={gradientStyle}>
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
				<h1
					style={{
						fontFamily: useCustomFont
							? 'Zarbi, sans-serif'
							: 'Clash Display, sans-serif'
					}}
				>
					{pokemon.name}
				</h1>
			</div>
		</div>
	);
};

export default PokedexCard;
