import axios from 'axios';

// Backend API URL (Apne backend ya mock API ka base URL yahan rakhein)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jsonplaceholder.typicode.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Interceptor: Har request ke sath token bhejne ke liye (Auth setup ke liye)
apiClient.interceptors.request.use(
  (config) => {
    // Client-side par cookie ya token check karke add kar sakte hain
    return config;
  },
  (error) => Promise.reject(error)
);