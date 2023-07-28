import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const DashboardPage = () => {
	const router = useRouter();

	// Vérifier la présence du token JWT au chargement de la page
	useEffect(() => {
		const jwtToken = localStorage.getItem('jwtToken');
		// Si le token JWT n'est pas présent, rediriger vers la page de connexion
		if (!jwtToken) {
			router.push('/clients/login');
		} else {
			// Si le token JWT est présent, vous pouvez ajouter ici toute logique
			// spécifique à la page de dashboard, comme charger les données de l'utilisateur, etc.
		}
	}, [router]);

	return (
		<div>
			<h1>Dashboard</h1>
			<p>Bienvenue sur votre dashboard !</p>
		</div>
	);
};

export default DashboardPage;
