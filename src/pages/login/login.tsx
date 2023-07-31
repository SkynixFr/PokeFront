// import { useState, FormEvent } from 'react';
// import { useRouter } from 'next/router';
// import Link from 'next/link';
// import axios from 'axios';
// import Form from '../components/form';

// const LoginPage = () => {
// 	const [errorMessage, setErrorMessage] = useState<string>('');
// 	const [isLoading, setIsLoading] = useState<boolean>(false);
// 	const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

// 	const router = useRouter();

// 	const handleSubmit = async (data: { [key: string]: string }) => {
// 		setErrorMessage(''); // Reset error message
// 		setIsLoading(true); // Set loading state to true during API call

// 		try {
// 			// Check if fields are not empty
// 			if (!data.Pseudo || !data.password) {
// 				setErrorMessage('Tous les champs doivent être remplis.');
// 				setIsLoading(false); // Reset loading state
// 				return;
// 			}

// 			// API call to verify register
// 			const response = await axios.post(
// 				'http://localhost:8080/api/v2/users/login',
// 				{
// 					data: data.Pseudo,
// 					password: data.password
// 				},
// 				{
// 					headers: {
// 						'Content-Type': 'application/json'
// 					}
// 				}
// 			);

// 			const responseData = response.data;

// 			if (response.status === 200) {
// 				// Login successful, show confirmation window and redirect to dashboard after 2 seconds
// 				setErrorMessage(responseData.message);
// 				setShowConfirmation(true);
// 				setIsLoading(false); // Reset loading state

// 				setTimeout(() => {
// 					setShowConfirmation(false);
// 					//On stocke le token jwt accessToken dans le localStorage
// 					localStorage.setItem('jwtToken', responseData.accessToken);
// 					//On stocke le refresh Token dans le localStorage
// 					localStorage.setItem('refreshToken', responseData.refreshToken);
// 					router.push('./pages/dashboard');
// 				}, 2000);
// 			} else {
// 				// Login failed, display error message
// 				setErrorMessage('Erreur lors de la connexion');
// 				setIsLoading(false); // Reset loading state
// 			}
// 		} catch (error) {
// 			// Handle API call errors
// 			setErrorMessage(
// 				'Erreur lors de la connexion du compte. Veuillez vérifier vos informations.'
// 			);
// 			setIsLoading(false); // Reset loading state
// 		}
// 	};

// 	const formFields = [
// 		{
// 			name: 'Pseudo',
// 			label: 'Pseudo',
// 			type: 'text'
// 		},
// 		{
// 			name: 'password',
// 			label: 'Mot de passe',
// 			type: 'password'
// 		}
// 	];

// 	return (
// 		<div>
// 			<h1>Page de connexion</h1>
// 			<Form
// 				fields={formFields}
// 				onSubmit={handleSubmit}
// 				isLoading={isLoading}
// 				submitButtonLabel="Se connecter" // Texte personnalisé pour le bouton de soumission
// 			/>

// 			{/* Confirmation window */}
// 			{showConfirmation && (
// 				<div className="confirmation-modal">
// 					<p>Vous êtes connecté ! Redirection dans quelques instants...</p>
// 				</div>
// 			)}

// 			{/* Error message */}
// 			{errorMessage && <p>{errorMessage}</p>}

// 			<p>Pas encore de compte ?</p>
// 			<Link href="./register">
// 				<p>Créer un compte</p>
// 			</Link>

// 			<style jsx>{`
// 				.confirmation-modal {
// 					position: fixed;
// 					top: 50%;
// 					left: 50%;
// 					transform: translate(-50%, -50%);
// 					background-color: #ffffff;
// 					padding: 20px;
// 					border: 1px solid #ccc;
// 					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
// 				}
// 			`}</style>
// 		</div>
// 	);
// };

// export default LoginPage;
