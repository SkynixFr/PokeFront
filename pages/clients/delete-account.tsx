import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const DeleteAccountPage = () => {
	const [errorMessage, setErrorMessage] = useState<string>('');
	const router = useRouter();
	const token =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYWlsQ2xpZW50Ijoicmlja3lAZ21haWwuY29tIiwibWRwQ2xpZW50IjoiJDJiJDEwJGIuQmVyY1VTQ0pTRXNIcTBxLnFUei5mU1FJZ1VUa1pFZWJWTGdZZWF0eHVYZTNIT0JidFV5IiwiaWF0IjoxNjkwMzcyOTQwLCJleHAiOjE2OTAzNzY1NDB9.J_GMS_yRvj-M8IS_iHYzRVY0XwLwnr4-m4Kc_wx-Q0g'; // Replace with the actual JWT token

	// Define the config object outside the useEffect hook
	const config = {
		method: 'delete',
		maxBodyLength: Infinity,
		url: 'http://localhost:8080/api/v1/client', // Replace with your API endpoint for deleting the account
		headers: {
			'x-access-token': token
		},
		data: {} // You can pass any data you need for the deletion request
	};

	useEffect(() => {
		// Check if the user is authenticated and has the necessary token here
		// If the user is not authenticated, you can redirect them to the login page
		// or show a message indicating that they need to log in first.
	}, []);

	const handleDeleteAccount = async () => {
		setErrorMessage(''); // Réinitialise le message d'erreur
		try {
			// Add your API call here to delete the user account
			const response = await axios.request(config);

			if (response.status === 200) {
				// Account deletion successful, redirect to the login page or a confirmation page
				router.push('/clients/login'); // Replace '/login' with your desired destination after account deletion
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
		</div>
	);
};

export default DeleteAccountPage;
