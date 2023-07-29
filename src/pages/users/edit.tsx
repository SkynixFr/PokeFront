import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import ReactLoading from 'react-loading';

const EditAccountPage = () => {
	const [pseudo, setPseudo] = useState<string>('');
	const [email, setEmail] = useState<string>(''); // New state for email
	const [password, setPassword] = useState<string>('');
	const [newPassword, setNewPassword] = useState<string>('');
	const [confirmPassword, setConfirmPassword] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isEditingPassword, setIsEditingPassword] = useState<boolean>(false);
	const [isEditingEmail, setIsEditingEmail] = useState<boolean>(false);
	const router = useRouter();
	const [showLoading, setShowLoading] = useState<boolean>(false);
	const [jwtToken, setJwtToken] = useState<string | null>(null);

	useEffect(() => {
		const token = localStorage.getItem('jwtToken');
		if (!token) {
			alert('Vous devez vous connecter pour accéder à cette page');
			router.push('../login');
		} else {
			setJwtToken(token);
		}
	}, [router]);

	const config = {
		method: 'put',
		maxBodyLength: Infinity,
		url: 'http://localhost:8080/api/v1/client',
		headers: {
			'x-access-token': jwtToken
		},
		data: {
			username: pseudo || null,
			mailClient: email || null,
			mdpClient: newPassword || null
		}
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrorMessage('');
		setIsLoading(true);
		setShowLoading(true);

		try {
			if (!password) {
				setErrorMessage('Veuillez entrer votre mot de passe');
				setIsLoading(false);
				setShowLoading(false);
				return;
			}

			if (
				isEditingPassword &&
				(newPassword === '' || confirmPassword === '')
			) {
				setErrorMessage(
					'Le nouveau mot de passe ou la confirmation est vide.'
				);
				setIsLoading(false);
				setShowLoading(false);
				return;
			}

			if (isEditingPassword && newPassword !== confirmPassword) {
				setErrorMessage(
					'Le nouveau mot de passe ne correspond pas à la confirmation.'
				);
				setIsLoading(false);
				setShowLoading(false);
				return;
			}

			const response = await axios.request(config);
			if (response.status === 200) {
				setErrorMessage('Compte mis à jour avec succès.');
				resetForm();
			}
		} catch (error) {
			setErrorMessage(
				'Erreur lors de la mise à jour du compte. Veuillez réessayer.'
			);
		} finally {
			setIsLoading(false);
			setShowLoading(false);
		}
	};

	const resetForm = () => {
		setPseudo('');
		setEmail('');
		setPassword('');
		setNewPassword('');
		setConfirmPassword('');
		setIsEditingPassword(false);
		setIsLoading(false);
	};

	return (
		<div>
			<h1>Modifier le compte</h1>
			<form onSubmit={handleSubmit}>
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
				{isEditingEmail && (
					<>
						<div>
							<label htmlFor="email">Email</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={e => setEmail(e.target.value)}
							/>
						</div>
					</>
				)}
				{isEditingPassword && (
					<>
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
					</>
				)}
				<button
					type="button"
					onClick={() => setIsEditingEmail(!isEditingEmail)}
				>
					Modifier le mail
				</button>

				<button
					type="button"
					onClick={() => setIsEditingPassword(!isEditingPassword)}
				>
					Modifier le mot de passe
				</button>
				<button type="submit" disabled={isLoading}>
					{isLoading ? 'Chargement...' : 'Mettre à jour'}
				</button>
			</form>
			{showLoading && (
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						marginTop: '20px'
					}}
				>
					<ReactLoading type="spin" color="#000" width={30} height={30} />
				</div>
			)}
			{errorMessage && <p>{errorMessage}</p>}
		</div>
	);
};

export default EditAccountPage;
