'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // ここで実際の認証処理を行う（今回は簡易的に）
    if (email && password) {
      localStorage.setItem('isLoggedIn', 'true')
      router.push('/tasks')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xs">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 mb-4 text-black"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-2 mb-4 text-black"
        required
      />
      <button
        type="submit"
        className="w-full p-2 bg-white text-black font-semibold"
      >
        sign in
      </button>
    </form>
  )
}