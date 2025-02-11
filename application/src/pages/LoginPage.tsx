import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { api } from "../lib/fetcher/api";

interface RegisterPageProps {

}

export function LoginPage(props: RegisterPageProps) {
  const authContext = useAuth();

  if (authContext.isAuthenticated) {
    return <Navigate to="/mytasks" replace />;
  }

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    console.log('Form submitted')
    const username = event.currentTarget.elements.namedItem('email') as HTMLInputElement
    const password = event.currentTarget.elements.namedItem('password') as HTMLInputElement
    api.user.login({
      username: username.value,
      password: password.value
    }).then(data => {
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      authContext.checkAuth();
      window.location.href = '/mytasks';
    }).catch(error => { 
      console.error('Error:', error)
    })
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-1/3 h-1/3 bg-slate-200 rounded-xl flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <form 
          className="w-full flex flex-col gap-4 items-center justify-center mt-4"
          onSubmit={(event) => handleLogin(event)}>
          <input
            type="text"
            placeholder="Email"
            name="email"
            className="w-3/4 h-10 p-2 rounded-xl border-2 border-slate-300 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          />
          <input
            type="password"
            placeholder="Password"
            name="password" 
            className="w-3/4 h-10 p-2 rounded-xl border-2 border-slate-300 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          />
          <button
            type="submit"
            className="w-3/4 h-10 rounded-xl bg-slate-500 text-white"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
};