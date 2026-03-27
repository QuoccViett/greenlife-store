import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear and redirect
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth API calls
export const authAPI = {
  login: (credentials) => apiClient.post("/auth/login", credentials),
  signup: (userData) => apiClient.post("/auth/signup", userData),
  logout: () => apiClient.post("/auth/logout"),
  getProfile: () => apiClient.get("/auth/profile"),
  updateProfile: (data) => apiClient.put("/auth/profile", data),
};

// Product API calls
export const productAPI = {
  getAll: (params) => apiClient.get("/products", { params }),
  getById: (id) => apiClient.get(`/products/${id}`),
  getByCategory: (category) => apiClient.get(`/products/category/${category}`),
  search: (query) => apiClient.get(`/products/search?q=${query}`),
};

// Cart API calls
export const cartAPI = {
  getCart: () => apiClient.get("/cart"),
  addItem: (item) => apiClient.post("/cart/add", item),
  removeItem: (productId) => apiClient.delete(`/cart/remove/${productId}`),
  updateQuantity: (productId, quantity) =>
    apiClient.put(`/cart/update/${productId}`, { quantity }),
  clearCart: () => apiClient.delete("/cart/clear"),
};

// Order API calls
export const orderAPI = {
  create: (orderData) => apiClient.post("/orders", orderData),
  getMyOrders: () => apiClient.get("/orders/my"),
  getOrderById: (id) => apiClient.get(`/orders/${id}`),
  updateOrder: (id, data) => apiClient.put(`/orders/${id}`, data),
};

// Wishlist API calls
export const wishlistAPI = {
  getWishlist: () => apiClient.get("/wishlist"),
  addItem: (productId) => apiClient.post("/wishlist/add", { productId }),
  removeItem: (productId) => apiClient.delete(`/wishlist/remove/${productId}`),
};

export default apiClient;
