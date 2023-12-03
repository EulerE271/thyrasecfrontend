import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import axios from "axios";
import { AuthProvider } from "./common/contexts/authContext.tsx";

axios.defaults.baseURL = import.meta.env.VITE_THYRA_API_URL; // Replace with your base URL
console.log('API URL:', import.meta.env.VITE_THYRA_API_URL);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
