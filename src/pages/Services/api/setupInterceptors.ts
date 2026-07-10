import axios from "axios";
import { toast } from "sonner";

let isAlertShown = false;

const handleSessionExpired = () => {
  const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");
  
  // If there is no token, they are not logged in, so it might just be a failed login attempt
  if (!token) return;

  if (isAlertShown) return;
  isAlertShown = true;
  
  toast.error("Session expired. Please log in again.");
  
  const isAdmin = localStorage.getItem("isAdminAuthenticated") === "true";
  
  localStorage.clear();
  
  setTimeout(() => {
    if (isAdmin) {
      window.location.href = "/adminlogin";
    } else {
      window.location.href = "/login";
    }
  }, 1500);
};

export const setupInterceptors = () => {
  // Axios Interceptor
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        handleSessionExpired();
      }
      return Promise.reject(error);
    }
  );

  // Fetch Interceptor (Patching global fetch)
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const response = await originalFetch.apply(this, args);
    if (response.status === 401) {
      handleSessionExpired();
    }
    return response;
  };
};
