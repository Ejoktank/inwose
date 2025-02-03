import React from "react";

interface RegisterPageProps {

}

function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault()
  console.log('Form submitted')
  const email = event.currentTarget.elements.namedItem('email') as HTMLInputElement
  const password = event.currentTarget.elements.namedItem('password') as HTMLInputElement
  const json = {
    email: email.value,
    password: password.value
  }
  fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(json)
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
    window.location.href = '/login'
  })
  .catch(error => {
    console.error('Error:', error)
  })
}

export function RegisterPage(props: RegisterPageProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-1/3 h-1/3 bg-slate-200 rounded-xl flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Register</h1>
        <form 
          className="w-full flex flex-col gap-4 items-center justify-center mt-4"
          onSubmit={handleFormSubmit}>
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
            Register
          </button>
        </form>
      </div>
      {/* <button
        className="px-4 py-2 bg-cyan-400 rounded-xl"
        onClick={() => {
          window.location.href = '/mytasks'
        }}
      >
        Push me
      </button> */}
    </div>
  )
};