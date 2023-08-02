// axiosInstance.ts

import axiosInstance from './axiosInstance';
import Cookies from 'js-cookie';
import { GetServerSidePropsContext } from 'next';
import { serialize } from 'cookie'; // Import the serialize function from 'cookie'
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';

let globalContext: GetServerSidePropsContext;

export function setGlobalContext(context: GetServerSidePropsContext) {
	globalContext = context;
}

// Function to delete the access and refresh tokens cookies
function deleteTokensCookies() {
	if (globalContext) {
		Cookies.remove('accessToken', { path: '/' });
		globalContext.res.setHeader(
			'Set-Cookie',
			'accessToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
		);
		globalContext.res.setHeader(
			'Set-Cookie',
			'refreshToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
		);
	} else {
		Cookies.remove('accessToken', { path: '/' });
		Cookies.remove('refreshToken', { path: '/' });
	}
}

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
						const cookies = serialize('accessToken', newAccessToken, {
							expires: new Date(Date.now() + 10 * 60 * 1000), // Set the expiration time of the cookie
							httpOnly: true,
							path: '/' // Set the path of the cookie to '/'
						});

						// Set the new cookie in the response headers
						if (globalContext) {
							globalContext.res.setHeader('Set-Cookie', cookies);
						} else {
							document.cookie = cookies;
						}

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

				// Delete the access and refresh token cookies
				deleteTokensCookies();

				// Check if it's a server-side request or client-side request
				if (globalContext) {
					// If it's a server-side request, use the response object to redirect
					globalContext.res.writeHead(302, {
						Location: '/login' // Redirect to the login page
					});
					globalContext.res.end();
				} else {
					// If it's a client-side request, use the router to redirect
					const router = useRouter();
					router.replace('/login');
				}
			}
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;
