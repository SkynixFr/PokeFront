import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';

const CreateAccountPage = () => {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [confirmPassword, setConfirmPassword] = useState<string>('');
	const [pseudo, setPseudo] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false); // Track loading state

	const router = useRouter();
	//vérifier validité de l'email "user"@"mail"."fin"
	const isValidEmail = (email: string): boolean => {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return emailRegex.test(email);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrorMessage(''); // Réinitialise le message d'erreur
		setIsLoading(true); // Set loading state to true

		try {
			// Check for empty fields
			if (!email || !password || !confirmPassword || !pseudo) {
				setErrorMessage('Tous les champs doivent être remplis.');
				setIsLoading(false); // Reset loading state
				return;
			}
			//Vérification Email et mot de passe avec mot de passe de confirmation
			if (!isValidEmail(email) || password !== confirmPassword) {
				setErrorMessage('Email ou mot de passe incorrect');
				setIsLoading(false); // Reset loading state
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
			console.log(email);
			console.log(password);
			console.log(pseudo);
			const data = response.data;
			if (response.status === 201) {
				// The response is successful (status code 201)
				console.log('Le client est créé');
				setErrorMessage('Compte Crée');
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
		} finally {
			setIsLoading(false); // Reset loading state after the API call is completed
		}
	};

	return (
		<div>
			<h1>Créer un compte</h1>
			<form onSubmit={handleSubmit}>
				{/* Form fields */}
				<button type="submit">Créer le compte</button>
			</form>
			{isLoading && <p>Loading...</p>}{' '}
			{/* Render loading screen if isLoading is true */}
			{errorMessage && <p>{errorMessage}</p>}
			<p>Déjà un compte ?</p>
			<Link href="./login">
				<p>Se connecter</p>
			</Link>
		</div>
	);
};

export default CreateAccountPage;
