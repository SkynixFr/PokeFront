import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';

const CreateAccountPage = () => {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [confirmPassword, setConfirmPassword] = useState<string>('');
	const [pseudo, setPseudo] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isAccountCreated, setIsAccountCreated] = useState<boolean>(false);

	const router = useRouter();

	//vérifier validité de l'email "user"@"mail"."fin"
	const isValidEmail = (email: string): boolean => {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return emailRegex.test(email);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrorMessage(''); // Réinitialise le message d'erreur
		setIsLoading(true);

		try {
			// Check for empty fields
			if (!email || !password || !confirmPassword || !pseudo) {
				setErrorMessage('Tous les champs doivent être remplis.');
				setIsLoading(false);
				return;
			}
			//Vérification Email et mot de passe avec mot de passe de confirmation
			if (!isValidEmail(email) || password !== confirmPassword) {
				setErrorMessage('Email ou mot de passe incorrect');
				setIsLoading(false);
				return;
			}
			// Appel à l'API pour la vérification du login
			const response = await axios.post(
				'http://localhost:8080/api/v1/client/register',
				{ mailClient: email, mdpClient: password, username: pseudo },
				{
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);

			if (response.status === 201) {
				// The response is successful (status code 201)
				console.log('Le client est créé');
				setErrorMessage(''); // Clear any previous error messages
				setIsAccountCreated(true); // Show the toast notification
				setIsLoading(false);
				// Redirect to the login page after 3 seconds
				setTimeout(() => {
					setIsAccountCreated(false);
					router.push('/clients/login');
				}, 3000);
			}
		} catch (error) {
			if (
				axios.isAxiosError(error) &&
				error.response &&
				error.response.status === 409
			) {
				// The request was made and the server responded with a 409 status code (Conflict)
				setErrorMessage('Pseudo ou Email déjà utilisé');
			} else {
				// Other Axios errors or network errors
				setErrorMessage(
					'Erreur lors de la création du compte. Veuillez vérifier vos informations.'
				);
			}
			setIsLoading(false);
		}
	};

	return (
		<div>
			<h1>Créer un compte</h1>
			<form onSubmit={handleSubmit}>
				{/* Form fields */}
				<div>
					<label htmlFor="pseudo">Pseudo</label>
					<input
						id="pseudo"
						type="text"
						value={pseudo}
						onChange={e => setPseudo(e.target.value)}
					/>
				</div>
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
			{isLoading && <p>Loading...</p>}{' '}
			{/* Render loading screen if isLoading is true */}
			{errorMessage && <p>{errorMessage}</p>}
			<p>Déjà un compte ?</p>
			<Link href="./login">
				<p>Se connecter</p>
			</Link>
			{isAccountCreated && (
				<div className="toast-notification">
					<p>Le compte a été créé avec succès!</p>
				</div>
			)}
			<style jsx>{`
				.toast-notification {
					position: fixed;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					background-color: #4caf50;
					color: #fff;
					padding: 10px 20px;
					border-radius: 4px;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
				}
			`}</style>
		</div>
	);
};

export default CreateAccountPage;
