import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import InputField from '../components/ui/InputField'
import SelectField from '../components/ui/SelectField'

const batches = ['2022-2026', '2023-2027', '2024-2028']
const branches = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'AI & DS']

const SignupPage = () => {
  const { signup } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    enrollment: '',
    email: '',
    password: '',
    batch: '',
    branch: '',
    profilePic: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields.')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    setIsLoading(true)

    try {
      const result = await signup({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        enrollment: formData.enrollment || undefined,
        batch: formData.batch || undefined,
        branch: formData.branch || undefined,
        profilePic: formData.profilePic || undefined,
      })

      if (!result.success) {
        setError(result.error || 'Signup failed. Please try again.')
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
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Join the circle</p>
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">Create your account</h1>
        <p className="text-sm text-neutral-600">
          Track your lost items, post found belongings, and build your trust score.
        </p>
      </header>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Full name"
            name="name"
            placeholder="Riya Sharma"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          <InputField
            label="Enroll number"
            name="enrollment"
            placeholder="ENG21CS045"
            value={formData.enrollment}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        <InputField
          label="Campus email"
          type="email"
          name="email"
          placeholder="riya.sharma@college.edu"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
        <InputField
          label="Password"
          type="password"
          name="password"
          placeholder="Create a strong password (min 8 characters)"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={isLoading}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Batch"
            name="batch"
            value={formData.batch}
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value="" disabled>
              Select batch
            </option>
            {batches.map((batch) => (
              <option key={batch} value={batch}>
                {batch}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Branch"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            disabled={isLoading}
          >
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

        <InputField
          label="Profile photo URL"
          name="profilePic"
          placeholder="https://"
          hint="You can update this later"
          value={formData.profilePic}
          onChange={handleChange}
          disabled={isLoading}
        />
        <Button type="submit" size="lg" fullWidth disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create account'}
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
