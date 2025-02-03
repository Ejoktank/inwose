import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { MyTasksPage } from "./pages/MyTasksPage";
import { RegisterPage } from "./pages/RegisterPage";
import { PariPage } from "./pages/PariPage";
import { LoginPage } from "./pages/LoginPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/mytasks" element={<MyTasksPage />} />
      <Route path="/pari" element={<PariPage />} />
      <Route path="/team" element={<MyTasksPage />} />
    </Routes>
  );
}