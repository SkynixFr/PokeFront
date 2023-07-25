import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

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
			// Vérifiez que l'email est valide avant d'appeler l'API
			if (!isValidEmail(email)) {
				setErrorMessage('Email invalide');
				return;
			}

			// Appel à l'API pour la vérification du login
			const response = await fetch(
				'http://localhost:8080/api/v1/client/login',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ mailClient: email, mdpClient: password })
				}
			);

			const data = await response.json();

			if (response.ok) {
				// La réponse indique que le login est valide, redirigez l'utilisateur vers une autre page
				//router.push('/dashboard'); // Assurez-vous d'avoir importé "import { useRouter } from 'next/router';"
				console.log('Le client est connecté');
				// Extraire le token JWT de la réponse et l'afficher dans la console
				const token = data.token;
				console.log('Token JWT :', token);
			} else {
				// La réponse indique que le login est invalide, affichez le message d'erreur
				setErrorMessage(data.message);
			}
		} catch (error) {
			setErrorMessage('Erreur lors de la connexion');
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
