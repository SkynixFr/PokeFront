import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';

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

	//Test si le mot de passe suit un bon pattern (1 majuscule, 1 minuscule, 1 caractère spécial, 8 caractères minimum)
	const isValidPassword = (password: string): boolean => {
		const mdpRegex = new RegExp(
			'^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$'
		);
		return mdpRegex.test(password);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrorMessage(''); // Réinitialise le message d'erreur

		try {
			// Ajoutez ici la logique pour la validation du formulaire de connexion
			// Vous pouvez envoyer les données (email et mot de passe) à votre backend pour la vérification.

			// Exemple factice pour la démonstration
			if (isValidEmail(email) && isValidPassword(password)) {
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
		console.log('password is correct ? : ' + isValidPassword(password));
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
		</div>
	);
};

export default LoginPage;
