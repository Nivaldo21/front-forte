import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

const createAxiosInstance = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
  });

  instance.interceptors.response.use(
    response => response,
    error => {
      toast.error(error.response?.data?.error || 'An error occurred, please try again later');
      return Promise.reject(error);
    }
  );

  return instance;
};

export const axiosCategories = createAxiosInstance(import.meta.env.VITE_API_CATEGORIES_URL);
export const axiosTransactions = createAxiosInstance(import.meta.env.VITE_API_TRANSACTIONS_URL);
export const axiosClients = createAxiosInstance(import.meta.env.VITE_API_CLIENTS_URL);