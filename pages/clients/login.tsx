import { useState, FormEvent } from 'react';
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
			// Vous pouvez envoyer les données (email et mot de passe) à votre backend pour la vérification.

			// Exemple factice pour la démonstration
			if (isValidEmail(email)) {
			} else {
				setErrorMessage('Email ou mot de passe incorrect');
			}
		} catch (error) {
			setErrorMessage('Erreur lors de la connexion');
		}
		console.log('email : ' + email);
		console.log('type email : ' + typeof email);
		console.log('email is correct ? : ' + isValidEmail(email));
		console.log('password :' + password);
		console.log('type password : ' + typeof password);
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
