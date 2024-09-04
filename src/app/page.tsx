import LoginForm from '../components/LoginForm'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <h1 className="mb-8 text-6xl font-bold">Make The Product</h1>
      <LoginForm />
    </main>
  )
}