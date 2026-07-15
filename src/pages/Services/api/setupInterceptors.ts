import axios from "axios";
import { toast } from "sonner";

let isAlertShown = false;

const handleSessionExpired = () => {
  const isAdmin = localStorage.getItem("isAdminAuthenticated") === "true";
  const userToken = localStorage.getItem("userToken");
  const accessToken = localStorage.getItem("access_token");
  
  const token = accessToken || userToken;
  
  // If there is no token, they are not logged in, so it might just be a failed login attempt
  if (!token && !isAdmin) return;

  if (isAlertShown) return;
  isAlertShown = true;
  
  toast.error("Session expired. Please log in again.");
  
  const isIndividualStudent = accessToken && !userToken && !isAdmin;
  
  localStorage.clear();
  
  setTimeout(() => {
    if (isAdmin) {
      window.location.href = "/adminlogin";
    } else if (isIndividualStudent) {
      window.location.href = "/individual";
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
