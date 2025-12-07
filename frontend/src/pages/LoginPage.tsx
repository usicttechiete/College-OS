import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import InputField from '../components/ui/InputField'

const LoginPage = () => {
  return (
    <section className="space-y-8">
      <header className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-purple-600">Welcome back</p>
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-primary via-secondary to-purple-600 bg-clip-text text-transparent">Log in to continue</h1>
        <p className="text-sm text-neutral-600">Access your lost queries, found posts, and campus messages.</p>
      </header>

      <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
        <InputField label="Campus email" type="email" name="email" placeholder="riya.sharma@college.edu" required />
        <InputField label="Password" type="password" name="password" placeholder="••••••••" required />
        <Button type="submit" size="lg" fullWidth>
          Log in
        </Button>
      </form>

      <footer className="flex flex-col items-center gap-2 text-sm text-neutral-600">
        <button type="button" className="text-xs font-medium text-purple-600 underline hover:text-purple-700">
          Forgot password?
        </button>
        <p>
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-semibold text-purple-600 hover:text-purple-700">
            Sign up
          </Link>
        </p>
      </footer>
    </section>
  )
}

export default LoginPage
