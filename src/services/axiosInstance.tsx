import axios from 'axios';

// Create a new Axios instance
const axiosInstance = axios.create({
	baseURL: 'http://localhost:8080/api/v2',
	withCredentials: true // Activating withCredentials option
});

export default axiosInstance;
