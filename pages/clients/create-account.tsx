import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';

const CreateAccountPage = () => {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [confirmPassword, setConfirmPassword] = useState<string>('');
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
			// Ajoutez ici la logique pour la création de compte
			// Vous pouvez envoyer les données (email et mot de passe) à votre backend pour enregistrer le compte.
			//Vérification Email et mot de passe avec mot de passe de confirmation
			if (!isValidEmail(email) || password != confirmPassword) {
				setErrorMessage('Email ou mot de passe incorrect');
			}
		} catch (error) {
			setErrorMessage('Erreur lors de la création du compte');
		}
	};

	return (
		<div>
			<h1>Créer un compte</h1>
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
				<div>
					<label htmlFor="confirmPassword">
						Confirmer le mot de passe
					</label>
					<input
						id="confirmPassword"
						type="password"
						value={confirmPassword}
						onChange={e => setConfirmPassword(e.target.value)}
					/>
				</div>
				<button type="submit">Créer le compte</button>
			</form>
			{errorMessage && <p>{errorMessage}</p>}
		</div>
	);
};

export default CreateAccountPage;
