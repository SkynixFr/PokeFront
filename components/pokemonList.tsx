import React from 'react';

interface ListItem {
	id: number;
	name: string;
	imageUrl: string;
}

interface PokemonListProps {
	items: ListItem[];
}

const PokemonList: React.FC<PokemonListProps> = ({ items }) => {
	return (
		<div className="pokemon-list">
			{items.map(item => (
				<div key={item.id} className="pokemon-card">
					<img
						src={item.imageUrl}
						alt={item.name}
						className="pokemon-image"
					/>
					<p className="pokemon-name">{item.name}</p>
				</div>
			))}
		</div>
	);
};

export default PokemonList;
