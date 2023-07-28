import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import ReactLoading from 'react-loading';

const LoginPage = () => {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [showConfirmation, setShowConfirmation] = useState<boolean>(false); // State to control the confirmation window

	const router = useRouter();

	// // Function to verify the validity of the email "user"@"mail"."fin"
	// const isValidEmail = (email: string): boolean => {
	// 	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	// 	return emailRegex.test(email);
	// };

	// Function to handle form submission
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrorMessage(''); // Reset error message
		setIsLoading(true); // Set loading state to true during API call

		try {
			// Check if fields are not empty
			if (!email || !password) {
				setErrorMessage('Tous les champs doivent être remplis.');
				setIsLoading(false); // Reset loading state
				return;
			}
			// // Check if the email is valid before calling the API
			// if (!isValidEmail(email)) {
			// 	setErrorMessage('Email invalide');
			// 	setIsLoading(false); // Reset loading state
			// 	return;
			// }
			// API call to verify login
			const response = await axios.post(
				'http://localhost:8080/api/v2/users/login',
				{ data: email, password: password },
				{
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
			console.log(response);

			const data = response.data;

			if (response.status === 200) {
				// Login successful, show confirmation window and redirect to dashboard after 2 seconds
				setErrorMessage(data.message);
				setShowConfirmation(true);
				setIsLoading(false); // Reset loading state

				setTimeout(() => {
					setShowConfirmation(false);
					localStorage.setItem('jwtToken', data.token); // Save JWT token to localStorage
					router.push('./dashboard');
				}, 2000);
			} else {
				// Login failed, display error message
				setErrorMessage('Erreur lors de la connexion');
				setIsLoading(false); // Reset loading state
			}
		} catch (error) {
			// Handle API call errors
			setErrorMessage(
				'Erreur lors de la connexion du compte. Veuillez vérifier vos informations.'
			);
			setIsLoading(false); // Reset loading state
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
						type="text"
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

			{/* Confirmation window */}
			{showConfirmation && (
				<div className="confirmation-modal">
					<p>Vous êtes connecté ! Redirection dans quelques instants...</p>
				</div>
			)}

			{/* Error message */}
			{errorMessage && <p>{errorMessage}</p>}

			<p>Pas encore de compte ?</p>
			<Link href="./create-account">
				<p>Créer un compte</p>
			</Link>

			<style jsx>{`
				.confirmation-modal {
					position: fixed;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					background-color: #ffffff;
					padding: 20px;
					border: 1px solid #ccc;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
				}
			`}</style>
		</div>
	);
};

export default LoginPage;
