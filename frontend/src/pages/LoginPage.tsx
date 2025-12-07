import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import InputField from '../components/ui/InputField'

const LoginPage = () => {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const result = await login(email, password)
      if (!result.success) {
        setError(result.error || 'Login failed. Please try again.')
      }
      // On success, GuestRoute will redirect to /home
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="space-y-8">
      <header className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Welcome back</p>
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">Log in to continue</h1>
        <p className="text-sm text-neutral-600">Access your lost queries, found posts, and campus messages.</p>
      </header>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField
          label="Campus email"
          type="email"
          name="email"
          placeholder="riya.sharma@college.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
        <InputField
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        <Button type="submit" size="lg" fullWidth disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log in'}
        </Button>
      </form>

      <footer className="flex flex-col items-center gap-2 text-sm text-neutral-600">
        <button type="button" className="text-xs font-medium text-primary underline hover:text-primary-light">
          Forgot password?
        </button>
        <p>
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-semibold text-primary hover:text-primary-light">
            Sign up
          </Link>
        </p>
      </footer>
    </section>
  )
}

export default LoginPage
