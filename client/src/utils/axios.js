import axios from 'axios';
import { APP_BASE_URL } from '../api/apiRoutes';

const axiosInstance = axios.create({
    baseURL: APP_BASE_URL,
});

export default axiosInstance;
