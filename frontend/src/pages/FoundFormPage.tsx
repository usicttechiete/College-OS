import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { foundApi, type FoundItemFormData } from '../lib/api'
import Button from '../components/ui/Button'
import InputField from '../components/ui/InputField'
import SelectField from '../components/ui/SelectField'
import TextAreaField from '../components/ui/TextAreaField'

const FoundFormPage = () => {
  const navigate = useNavigate()
  const { session } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!session?.access_token) {
      setError('You must be logged in to post a found item')
      return
    }

    const formData = new FormData(event.currentTarget)
    const imageUrl = formData.get('imageUrl')?.toString().trim()

    // Convert datetime-local to ISO 8601
    const foundAtLocal = formData.get('foundAt')?.toString()
    let foundAt = ''
    if (foundAtLocal) {
      // Convert local datetime to ISO string
      const date = new Date(foundAtLocal)
      foundAt = date.toISOString()
    }

    const formDataToSubmit: FoundItemFormData = {
      title: formData.get('title')?.toString() || '',
      category: formData.get('category')?.toString() || '',
      description: formData.get('description')?.toString() || '',
      location: formData.get('location')?.toString() || '',
      foundAt,
      submissionType: (formData.get('submission')?.toString() || 'keep-with-me') as 'keep-with-me' | 'submit-to-desk',
      imageUrls: imageUrl ? [imageUrl] : [],
    }

    // Validate required fields
    if (!formDataToSubmit.title || !formDataToSubmit.category || !formDataToSubmit.description || !formDataToSubmit.location || !formDataToSubmit.foundAt) {
      setError('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await foundApi.create(session.access_token, formDataToSubmit)

      if (response.success) {
        // Redirect to found page on success
        navigate('/found')
      } else {
        setError(response.error || 'Failed to create found item. Please try again.')
      }
    } catch (err) {
      console.error('Error creating found item:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold bg-gradient-to-r from-secondary to-cyan-500 bg-clip-text text-transparent">Post a found item</h1>
        <p className="text-sm text-neutral-600">
          Share details so the rightful owner can identify and reclaim their belonging.
        </p>
      </header>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <InputField label="Item title" name="title" placeholder="e.g. Black Lenovo laptop bag" required disabled={isSubmitting} />
        <SelectField label="Category" name="category" defaultValue="" required disabled={isSubmitting}>
          <option value="" disabled>
            Select category
          </option>
          <option value="Electronics">Electronics</option>
          <option value="Bags">Bags</option>
          <option value="Accessories">Accessories</option>
          <option value="Keys">Keys</option>
          <option value="Books">Books</option>
          <option value="ID Cards">ID Cards</option>
          <option value="Other">Other</option>
        </SelectField>
        <InputField label="Where did you find it?" name="location" placeholder="Block C, Computer Lab" required disabled={isSubmitting} />
        <InputField label="When did you find it?" name="foundAt" type="datetime-local" required disabled={isSubmitting} />
        <TextAreaField
          label="Condition & description"
          name="description"
          placeholder="Mention unique marks, contents, or proof required."
          required
          disabled={isSubmitting}
        />
        <SelectField label="Submission preference" name="submission" defaultValue="keep-with-me" disabled={isSubmitting}>
          <option value="keep-with-me">Keep with me</option>
          <option value="submit-to-desk">Submitted to lost & found desk</option>
        </SelectField>
        <InputField label="Image URL" name="imageUrl" placeholder="https://" disabled={isSubmitting} />

        <div className="flex gap-3">
          <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? 'Publishing...' : 'Publish found post'}
          </Button>
          <Button type="button" variant="ghost" size="lg" className="flex-1" onClick={() => navigate(-1)} disabled={isSubmitting}>
            Cancel
          </Button>
        </div>
      </form>
    </section>
  )
}

export default FoundFormPage
