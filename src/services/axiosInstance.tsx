import axios from 'axios';
import Cookies from 'js-cookie';
import { parse } from 'cookie';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';

let globalContext: GetServerSidePropsContext;

export function setGlobalContext(context: GetServerSidePropsContext) {
	globalContext = context;
}

// Create a new Axios instance
const axiosInstance = axios.create({
	baseURL: 'http://localhost:8080/api/v2'
});

// Add an interceptor to automatically attach the access token to requests
axiosInstance.interceptors.request.use(
	config => {
		// Modify the request configuration to include the access token
		const accessToken =
			Cookies.get('accessToken') || globalContext.req.cookies.accessToken;
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
axiosInstance.interceptors.response.use(
	response => {
		return response;
	},
	async error => {
		const originalRequest = error.config;
		console.log(originalRequest);
		if (
			error.response &&
			error.response.status === 401 &&
			!originalRequest._retry
		) {
			originalRequest._retry = true;
			try {
				// Call the refresh token endpoint
				const refreshToken =
					Cookies.get('refreshToken') ||
					globalContext.req.cookies.refreshToken;
				if (refreshToken) {
					const response = await axiosInstance.post(
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
						Cookies.set('accessToken', newAccessToken, {
							expires: 10 / (24 * 60)
						});

						// Retry the original request with the new access token
						originalRequest.headers[
							'Authorization'
						] = `Bearer ${newAccessToken}`;
						return axiosInstance(originalRequest);
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
			}
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;
