import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import Form, { FormField } from '../components/form';

const CreateAccountPage = () => {
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isAccountCreated, setIsAccountCreated] = useState<boolean>(false);

	const router = useRouter();

	//vérifier validité de l'email "user"@"mail"."fin"
	const isValidEmail = (email: string): boolean => {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return emailRegex.test(email);
	};
	const handleSubmit = async (data: { [key: string]: string }) => {
		setErrorMessage(''); // Reset error message
		setIsLoading(true);

		try {
			// Check for empty fields
			if (
				!data.email ||
				!data.password ||
				!data.confirmPassword ||
				!data.pseudo
			) {
				setErrorMessage('Tous les champs doivent être remplis.');
				setIsLoading(false);
				return;
			}
			// Verify Email and password with password confirmation
			if (
				!isValidEmail(data.email) ||
				data.password !== data.confirmPassword
			) {
				setErrorMessage('Email ou mot de passe incorrect');
				setIsLoading(false);
				return;
			}
			// API call to verify register
			const response = await axios.post(
				'http://localhost:8080/api/v2/users/register',
				{
					email: data.email,
					password: data.password,
					username: data.pseudo
				},
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
					router.push('/login');
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

	const formFields: FormField[] = [
		{
			name: 'pseudo',
			label: 'Pseudo',
			type: 'text'
		},
		{
			name: 'email',
			label: 'Email',
			type: 'email'
		},
		{
			name: 'password',
			label: 'Mot de passe',
			type: 'password'
		},
		{
			name: 'confirmPassword',
			label: 'Confirmer le mot de passe',
			type: 'password'
		}
	];

	return (
		<div>
			<h1>Créer un compte</h1>
			<Form
				fields={formFields}
				onSubmit={handleSubmit}
				isLoading={isLoading}
				submitButtonLabel="Créer le compte" // Texte personnalisé pour le bouton de soumission
			/>

			{isLoading && <p>Loading...</p>}
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
