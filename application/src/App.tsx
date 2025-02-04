import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { MyTasksPage } from "./pages/MyTasksPage";
import { RegisterPage } from "./pages/RegisterPage";
import { PariPage } from "./pages/PariPage";
import { LoginPage } from "./pages/LoginPage";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

export function App() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    // Validate token with backend if needed
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/mytasks" element={<MyTasksPage />} />
        <Route 
            path="/mytasks" 
            element={
              <ProtectedRoute>
                <MyTasksPage />
              </ProtectedRoute>
            } 
          />
        <Route path="/pari" element={<PariPage />} />
        <Route path="/team" element={<MyTasksPage />} />
      </Routes>
    </AuthProvider>
  );
}