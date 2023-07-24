import { useRouter } from 'next/router';

const Pokemon = () => {
	const router = useRouter();
	return <h1>Pokémon : {router.query.name}</h1>;
};

export default Pokemon;
