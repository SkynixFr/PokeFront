import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const EditAccountPage = () => {
	const [pseudo, setPseudo] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [newPassword, setNewPassword] = useState<string>('');
	const [confirmPassword, setConfirmPassword] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();

	// État local pour stocker la valeur du token JWT
	const [jwtToken, setJwtToken] = useState<string | null>(null);

	// Vérifier la présence du token JWT au chargement de la page
	useEffect(() => {
		const token = localStorage.getItem('jwtToken');
		// Si le token JWT n'est pas présent, rediriger vers la page de connexion
		if (!token) {
			alert('Vous devez vous connecter pour accéder à cette page');
			router.push('/clients/login');
		} else {
			// Stocker la valeur du token JWT dans l'état local
			setJwtToken(token);
		}
	}, [router]);

	// Votre configuration prédéfinie ici (incluant le token JWT)
	const config = {
		method: 'put',
		maxBodyLength: Infinity,
		url: 'http://localhost:8080/api/v1/client', // Replace with your API endpoint for deleting the account
		headers: {
			'x-access-token': jwtToken
		},
		data: {
			username: pseudo || null,
			mdpClient: newPassword || null
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
