import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const EditAccountPage = () => {
	const [pseudo, setPseudo] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [newPassword, setNewPassword] = useState<string>('');
	const [confirmPassword, setConfirmPassword] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const token =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYWlsQ2xpZW50Ijoicmlja3lAZ21haWwuY29tIiwibWRwQ2xpZW50IjoiJDJiJDEwJFdubmt3cmJPcjU1bENXbWFGaVc3Y2VmRlcxZHRRSE9GWkZZZ1FhUzdRRGhBdjNyc052MHN1IiwiaWF0IjoxNjkwMzc3MzE5LCJleHAiOjE2OTAzODA5MTl9.cRwDI0R_wKl9aLLVPVVA1d39FRqw4tQBODZYyHIdUIA';
	const router = useRouter();

	// Votre configuration prédéfinie ici (incluant le token JWT)
	const config = {
		method: 'put',
		maxBodyLength: Infinity,
		url: 'http://localhost:8080/api/v1/client', // Replace with your API endpoint for deleting the account
		headers: {
			'x-access-token': token
		},
		data: {
			username: pseudo,
			mdpClient: newPassword || password
		}
	};

	// Function to handle form submission
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrorMessage(''); // Reset error message
		setIsLoading(true); // Set loading state

		try {
			// Check if new password and confirm password match
			if (newPassword !== confirmPassword) {
				setErrorMessage(
					'Le nouveau mot de passe ne correspond pas à la confirmation.'
				);
				setIsLoading(false); // Reset loading state
				return;
			}

			//Call à l'API de modif
			const response = await axios.request(config);
			if (response.status === 200) {
				setErrorMessage('Compte mis à jour avec succès.');
			}
		} catch (error) {
			setErrorMessage(
				'Erreur lors de la mise à jour du compte. Veuillez réessayer.'
			);
		} finally {
			setIsLoading(false); // Reset loading state after the API call is completed
		}
	};

	return (
		<div>
			<h1>Modifier le compte</h1>
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
					<label htmlFor="password">Mot de passe actuel</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
				</div>
				<div>
					<label htmlFor="newPassword">Nouveau mot de passe</label>
					<input
						id="newPassword"
						type="password"
						value={newPassword}
						onChange={e => setNewPassword(e.target.value)}
					/>
				</div>
				<div>
					<label htmlFor="confirmPassword">
						Confirmer le nouveau mot de passe
					</label>
					<input
						id="confirmPassword"
						type="password"
						value={confirmPassword}
						onChange={e => setConfirmPassword(e.target.value)}
					/>
				</div>
				<button type="submit" disabled={isLoading}>
					{isLoading ? 'Chargement...' : 'Mettre à jour'}
				</button>
			</form>
			{errorMessage && <p>{errorMessage}</p>}
		</div>
	);
};

export default EditAccountPage;