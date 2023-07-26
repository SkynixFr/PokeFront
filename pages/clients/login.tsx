import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import ReactLoading from 'react-loading';

const LoginPage = () => {
	// États pour stocker les valeurs des champs de formulaire et les messages d'erreur
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false); // Suivre l'état de chargement de l'API

	const router = useRouter();

	// Fonction pour vérifier la validité de l'email "user"@"mail"."fin"
	const isValidEmail = (email: string): boolean => {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return emailRegex.test(email);
	};

	// Fonction pour gérer la soumission du formulaire
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrorMessage(''); // Réinitialise le message d'erreur
		setIsLoading(true); // Définir l'état de chargement à true pendant l'appel à l'API

		try {
			// Vérifier si des champs ne sont pas vides
			if (!email || !password) {
				setErrorMessage('Tous les champs doivent être remplis.');
				return;
			}
			// Vérifiez que l'email est valide avant d'appeler l'API
			if (!isValidEmail(email)) {
				setErrorMessage('Email invalide');
				setIsLoading(false); // Réinitialiser l'état de chargement
				return;
			}

			// Simuler un délai de 2 secondes avant d'appeler l'API
			await new Promise(resolve => setTimeout(resolve, 2000));

			// Appel à l'API pour la vérification du login
			const response = await axios.post(
				'http://localhost:8080/api/v1/client/login',
				{ mailClient: email, mdpClient: password },
				{
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);

			const data = response.data;

			if (response.status === 201) {
				// La réponse indique que le login est valide, redirigez l'utilisateur vers une autre page si nécessaire
				console.log('Le client est connecté');
				// Extraire le token JWT de la réponse et l'afficher dans la console
				const token = data.token;
				console.log('Token JWT :', token);
				setErrorMessage(data.message);
			} else {
				// La réponse indique que le login est invalide, affichez le message d'erreur
				setErrorMessage('Erreur lors de la connexion');
			}
		} catch (error) {
			if (
				axios.isAxiosError(error) &&
				error.response &&
				error.response.status === 404
			) {
				// La requête a été effectuée et le serveur a répondu avec un code d'état 409 (Conflit)
				setErrorMessage('Utilisateur non présent');
			} else {
				// Autres erreurs Axios ou erreurs réseau
				setErrorMessage(
					'Erreur lors de la connexion du compte. Veuillez vérifier vos informations.'
				);
			}
		} finally {
			// Assurez-vous que l'état de chargement est réinitialisé après 2 secondes, même s'il y a eu une erreur lors de la tentative de connexion
			setTimeout(() => setIsLoading(false), 2000);
		}
	};

	return (
		<div>
			<h1>Page de connexion</h1>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="email">Email</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={e => setEmail(e.target.value)}
					/>
				</div>
				<div>
					<label htmlFor="password">Mot de passe</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
				</div>
				<button type="submit" disabled={isLoading}>
					{isLoading ? (
						<ReactLoading
							type="spin"
							color="#ffffff"
							height={20}
							width={20}
						/>
					) : (
						'Se connecter'
					)}
				</button>
			</form>
			{errorMessage && <p>{errorMessage}</p>}
			<p>Pas encore de compte ?</p>
			<Link href="./create-account">
				<p>Créer un compte</p>
			</Link>
		</div>
	);
};

export default LoginPage;
