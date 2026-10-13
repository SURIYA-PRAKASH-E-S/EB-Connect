import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add access token to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    // Don't send an old access token to login or refresh
    if (
      token &&
      !config.url.includes("login/") &&
      !config.url.includes("token/refresh/")
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired access token
API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Access token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("login/") &&
      !originalRequest.url.includes("token/refresh/")
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh");

      if (!refreshToken) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");

        window.location.href = "/login";

        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/token/refresh/",
          {
            refresh: refreshToken,
          }
        );

        const newAccessToken = response.data.access;

        // Save new access token
        localStorage.setItem("access", newAccessToken);

        // Update original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Try the original request again
        return API(originalRequest);
      } catch (refreshError) {
        // Refresh token is also expired/invalid
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;