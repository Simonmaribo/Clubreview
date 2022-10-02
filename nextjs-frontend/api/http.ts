import axios, { AxiosInstance } from 'axios';

const http: AxiosInstance = axios.create({
    withCredentials: true,
    timeout: 20000,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000',
});

export default http;