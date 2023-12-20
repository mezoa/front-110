import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: 'https://495e-2001-4456-16e-1f00-bdc3-1729-1b4-a65f.ngrok-free.app/expenseApp/public',
  headers: {
    Authorization: `Bearer ${Cookies.get('accessToken')}`,
    'ngrok-skip-browser-warning': '1', // Add this line
  }
});

const axiosInstance = axios.create({
  baseURL: 'https://495e-2001-4456-16e-1f00-bdc3-1729-1b4-a65f.ngrok-free.app/expenseApp/public',
  headers: {
    'ngrok-skip-browser-warning': '1', // Add this line
  }
});

export { axiosInstance, api };