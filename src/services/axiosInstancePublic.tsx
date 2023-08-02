// axiosInstancePublic.ts

import axios from 'axios';
import Cookies from 'js-cookie';
import { serialize } from 'cookie'; // Import the serialize function from 'cookie'

// Créer une instance d'axios pour le client (navigateur)
const axiosInstancePublic = axios.create({
	baseURL: 'http://localhost:8080/api/v2' // Remplacez l'URL par l'URL de votre API
});

// Function to delete the access and refresh tokens cookies
function deleteTokensCookies() {
	Cookies.remove('accessToken', { path: '/' });
	Cookies.remove('refreshToken', { path: '/' });
}

// Add an interceptor to automatically attach the access token to requests
axiosInstancePublic.interceptors.request.use(
	config => {
		// Modify the request configuration to include the access token
		const accessToken = Cookies.get('accessToken');
		if (accessToken) {
			config.headers['Authorization'] = `Bearer ${accessToken}`;
		}
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

// Add an interceptor to refresh the access token if a 401 error occurs
axiosInstancePublic.interceptors.response.use(
	response => {
		return response;
	},
	async error => {
		const originalRequest = error.config;
		if (
			error.response &&
			error.response.status === 401 &&
			!originalRequest._retry
		) {
			originalRequest._retry = true;
			try {
				// Call the refresh token endpoint
				const refreshToken = Cookies.get('refreshToken');
				if (refreshToken) {
					const response = await axiosInstancePublic.post(
						'/users/refreshToken',
						{},
						{
							headers: {
								Authorization: `Bearer ${refreshToken}`
							}
						}
					);
					if (response.status === 200) {
						const newAccessToken = response.data.accessToken;

						// Update the access token cookie with the new token
						const cookies = serialize('accessToken', newAccessToken, {
							expires: new Date(Date.now() + 10 * 60 * 1000), // Set the expiration time of the cookie
							httpOnly: true,
							path: '/' // Set the path of the cookie to '/'
						});

						// Set the new cookie in the browser
						document.cookie = cookies;

						// Retry the original request with the new access token
						originalRequest.headers[
							'Authorization'
						] = `Bearer ${newAccessToken}`;
						return axiosInstancePublic(originalRequest);
					} else {
						throw new Error('Failed to refresh access token');
					}
				} else {
					throw new Error('No refresh token found');
				}
			} catch (error) {
				// If the refresh token request fails, log the user out or handle the error as needed
				console.log('Failed to refresh access token:', error);
				// For example, you might redirect the user to the login page or show an error message

				// Delete the access and refresh token cookies
				deleteTokensCookies();

				// Redirect the user to the login page
				window.location.href = '/login';
			}
		}
		return Promise.reject(error);
	}
);

export default axiosInstancePublic;
