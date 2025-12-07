import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import InputField from '../components/ui/InputField'
import SelectField from '../components/ui/SelectField'

const batches = ['2022-2026', '2023-2027', '2024-2028']
const branches = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'AI & DS']

const SignupPage = () => {
  return (
    <section className="space-y-8">
      <header className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Join the circle</p>
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">Create your account</h1>
        <p className="text-sm text-neutral-600">
          Track your lost items, post found belongings, and build your trust score.
        </p>
      </header>

      <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="Full name" name="name" placeholder="Riya Sharma" required />
          <InputField label="Enroll number" name="enroll" placeholder="ENG21CS045" required />
        </div>
        <InputField label="Campus email" type="email" name="email" placeholder="riya.sharma@college.edu" required />
        <InputField label="Password" type="password" name="password" placeholder="Create a strong password" required />

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Batch" name="batch" defaultValue="">
            <option value="" disabled>
              Select batch
            </option>
            {batches.map((batch) => (
              <option key={batch} value={batch}>
                {batch}
              </option>
            ))}
          </SelectField>
          <SelectField label="Branch" name="branch" defaultValue="">
            <option value="" disabled>
              Select branch
            </option>
            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </SelectField>
        </div>

        <InputField label="Profile photo URL" name="profilePic" placeholder="https://" hint="You can update this later" />
        <Button type="submit" size="lg" fullWidth>
          Create account
        </Button>
      </form>

      <footer className="text-center text-sm text-neutral-600">
        Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:text-primary-light">
          Log in
        </Link>
      </footer>
    </section>
  )
}

export default SignupPage
