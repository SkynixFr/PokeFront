import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Header = () => {
	const router = useRouter();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	// Vérifier la présence du token JWT au chargement du composant
	useEffect(() => {
		const jwtToken = localStorage.getItem('jwtToken');
		setIsLoggedIn(!!jwtToken); // Convertir le token en booléen et mettre à jour l'état isLoggedIn
	}, []);

	const handleLogout = () => {
		setIsLoggingOut(true); // Activer l'état isLoggingOut pour afficher le message de déconnexion en cours

		// Supprimer le token JWT du local storage ou de tout autre moyen de stockage utilisé
		localStorage.removeItem('jwtToken');

		// Rediriger l'utilisateur vers la page de connexion après une courte pause (2 secondes)
		setTimeout(() => {
			setIsLoggedIn(false); // Réinitialiser l'état isLoggedIn après la déconnexion
			setIsLoggingOut(false); // Désactiver l'état isLoggingOut après la déconnexion
			router.push('/clients/login');
		}, 2000);
	};

	return (
		<header>
			<h1>Menu</h1>
			{isLoggedIn && (
				<>
					<a href="./edit-account">Modifier le compte</a>
					<a href="./delete-account">Supprimer le compte</a>
					<button onClick={handleLogout} disabled={isLoggingOut}>
						{isLoggingOut ? 'Déconnexion en cours...' : 'Se déconnecter'}
					</button>
				</>
			)}
		</header>
	);
};

export default Header;
