import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import InputField from '../components/ui/InputField'
import SelectField from '../components/ui/SelectField'
import TextAreaField from '../components/ui/TextAreaField'

const FoundFormPage = () => {
  const navigate = useNavigate()

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Post a found item</h1>
        <p className="text-sm text-neutral-600">
          Share details so the rightful owner can identify and reclaim their belonging.
        </p>
      </header>

      <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
        <InputField label="Item title" name="title" placeholder="e.g. Black Lenovo laptop bag" required />
        <SelectField label="Category" name="category" defaultValue="" required>
          <option value="" disabled>
            Select category
          </option>
          <option value="Electronics">Electronics</option>
          <option value="Bags">Bags</option>
          <option value="Accessories">Accessories</option>
          <option value="Keys">Keys</option>
        </SelectField>
        <InputField label="Where did you find it?" name="location" placeholder="Block C, Computer Lab" required />
        <InputField label="When did you find it?" name="foundAt" type="datetime-local" required />
        <TextAreaField
          label="Condition & description"
          name="description"
          placeholder="Mention unique marks, contents, or proof required."
          required
        />
        <SelectField label="Submission preference" name="submission">
          <option value="keep-with-me">Keep with me</option>
          <option value="submit-to-desk">Submitted to lost & found desk</option>
        </SelectField>
        <InputField label="Image URL" name="imageUrl" placeholder="https://" />

        <div className="flex gap-3">
          <Button type="submit" size="lg" className="flex-1">
            Publish found post
          </Button>
          <Button type="button" variant="ghost" size="lg" className="flex-1" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>
    </section>
  )
}

export default FoundFormPage
