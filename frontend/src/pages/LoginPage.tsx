import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import InputField from '../components/ui/InputField'

const LoginPage = () => {
  return (
    <section className="space-y-8">
      <header className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--color-muted)]">Welcome back</p>
        <h1 className="text-2xl font-semibold text-[var(--color-brand-foreground)]">Log in to continue</h1>
        <p className="text-sm text-[var(--color-muted)]">Access your lost queries, found posts, and campus messages.</p>
      </header>

      <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
        <InputField label="Campus email" type="email" name="email" placeholder="riya.sharma@college.edu" required />
        <InputField label="Password" type="password" name="password" placeholder="••••••••" required />
        <Button type="submit" size="lg" fullWidth>
          Log in
        </Button>
      </form>

      <footer className="flex flex-col items-center gap-2 text-sm text-[var(--color-muted)]">
        <button type="button" className="text-xs font-medium text-[var(--color-brand-foreground)] underline">
          Forgot password?
        </button>
        <p>
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-semibold text-[var(--color-brand-foreground)]">
            Sign up
          </Link>
        </p>
      </footer>
    </section>
  )
}

export default LoginPage
