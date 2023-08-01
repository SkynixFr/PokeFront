import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Header = () => {
	const router = useRouter();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	// Vérifier la présence du token JWT au chargement du composant
	useEffect(() => {
		const jwtToken = localStorage.getItem('jwtToken');
		const isAuthenticated = !!jwtToken;
		setIsLoggedIn(isAuthenticated); // Mettre à jour l'état isLoggedIn en fonction de la présence du token JWT
	}, [router.pathname]);

	const handleLogout = () => {
		setIsLoggingOut(true); // Activer l'état isLoggingOut pour afficher le message de déconnexion en cours

		// Supprimer le token JWT du local storage ou de tout autre moyen de stockage utilisé
		localStorage.removeItem('jwtToken');

		// Rediriger l'utilisateur vers la page de connexion après une courte pause (2 secondes)
		setTimeout(() => {
			setIsLoggedIn(false); // Réinitialiser l'état isLoggedIn après la déconnexion
			setIsLoggingOut(false); // Désactiver l'état isLoggingOut après la déconnexion
			router.push('./login');
		}, 2000);
	};

	return (
		<header>
			<h1>Menu</h1>
			<ul>
				<li>
					<Link href="/pokedex">Pokedex</Link>
				</li>
				<li>
					<Link href="/user/me">Profil</Link>
				</li>
			</ul>
			{/* {isLoggedIn ? (
				<>
					<button onClick={handleLogout} disabled={isLoggingOut}>
						{isLoggingOut ? 'Déconnexion en cours...' : 'Se déconnecter'}
					</button>
				</>
			) : null} */}
			{/* Afficher les liens "Se connecter" et "Créer un compte" uniquement si l'utilisateur n'est pas connecté */}
			{/* {!isLoggedIn && (
				<>
					<a href="./login">Se connecter</a>
					<a href="./create-account">Créer un compte</a>
				</>
			)} */}
		</header>
	);
};

export default Header;
