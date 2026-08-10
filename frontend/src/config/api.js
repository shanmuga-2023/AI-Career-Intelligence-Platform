// Centralized API configuration for Vercel deployment & local development

const getApiBaseUrl = () => {
    if (import.meta.env.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');
    }
    return 'http://localhost:5050';
};

const getMlApiBaseUrl = () => {
    if (import.meta.env.VITE_ML_API_BASE_URL) {
        return import.meta.env.VITE_ML_API_BASE_URL.replace(/\/$/, '');
    }
    // Fallback to Express backend if VITE_API_BASE_URL is set (Express proxies ML routes under /api)
    if (import.meta.env.VITE_API_BASE_URL) {
        return `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/api`;
    }
    return 'http://localhost:8000';
};

export const API_BASE_URL = getApiBaseUrl();
export const ML_API_BASE_URL = getMlApiBaseUrl();

export default {
    API_BASE_URL,
    ML_API_BASE_URL
};
