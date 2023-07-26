import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const DeleteAccountPage = () => {
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string>('');
	const router = useRouter();
	// Token JWT à remplacer en cas de changement
	const token =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYWlsQ2xpZW50Ijoicmlja3lAZ21haWwuY29tIiwibWRwQ2xpZW50IjoiJDJiJDEwJFB1dEY2T2swTWEubXRndE01Rk85U3VtNVJ5VXNqMTJ5QjJydjBOMmE4eFNDMnJ0emlZSmF5IiwiaWF0IjoxNjkwMzczNjcwLCJleHAiOjE2OTAzNzcyNzB9._S8EC9zeVtJdKbU1gv3ttt1ts8mc9M0tLQDh0Sncy-Q';

	// Define the config object here
	const config = {
		method: 'delete',
		maxBodyLength: Infinity,
		url: 'http://localhost:8080/api/v1/client', // Replace with your API endpoint for deleting the account
		headers: {
			'x-access-token': token
		},
		data: {} // You can pass any data you need for the deletion request
	};
	const handleDeleteAccount = async () => {
		setErrorMessage(''); // Réinitialise le message d'erreur
		try {
			// Check if the user is authenticated and has the necessary token here
			// If the user is not authenticated, you can redirect them to the login page
			// or show a message indicating that they need to log in first.

			// Add your API call here to delete the user account
			const response = await axios.request(config);

			if (response.status === 200) {
				// Account deletion successful, show confirmation window and redirect after 5 seconds
				setShowConfirmation(true);
				setTimeout(() => {
					setShowConfirmation(false);
					router.push('/clients/login'); // Redirect to the login page after 5 seconds
				}, 5000);
			} else {
				// Handle other response statuses if needed
				setErrorMessage('Error deleting account');
			}
		} catch (error) {
			// Handle any errors that occur during the API call
			setErrorMessage('Error deleting account');
		}
	};

	return (
		<div>
			<h1>Delete Account</h1>
			<p>Are you sure you want to delete your account?</p>
			<button onClick={handleDeleteAccount}>Delete Account</button>
			{errorMessage && <p>{errorMessage}</p>}

			{showConfirmation && (
				<div className="confirmation-modal">
					<p>
						Votre compte a été supprimé, vous allez être redirigé dans
						quelques instants
					</p>
				</div>
			)}

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

export default DeleteAccountPage;
