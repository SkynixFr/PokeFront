import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';

const LoginPage = () => {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState<string>('');

	const router = useRouter();

	//vérifier validité de l'email "user"@"mail"."fin"
	const isValidEmail = (email: string): boolean => {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return emailRegex.test(email);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrorMessage(''); // Réinitialise le message d'erreur

		try {
			// Vérifier si des champs ne sont pas vides
			if (!email || !password) {
				setErrorMessage('Tous les champs doivent être remplis.');
				return;
			}
			// Vérifiez que l'email est valide avant d'appeler l'API
			if (!isValidEmail(email)) {
				setErrorMessage('Email invalide');
			}

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
				// La réponse indique que le login est valide, redirigez l'utilisateur vers une autre page
				//router.push('/dashboard'); // Assurez-vous d'avoir importé "import { useRouter } from 'next/router';"
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
				// The request was made and the server responded with a 409 status code (Conflict)
				setErrorMessage('Utilisateur non présent');
			} else {
				// Other Axios errors or network errors
				setErrorMessage(
					'Erreur lors de la connexion du compte. Veuillez vérifier vos informations.'
				);
			}
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
				<button type="submit">Se connecter</button>
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
