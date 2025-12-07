import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import InputField from '../components/ui/InputField'
import SelectField from '../components/ui/SelectField'
import TextAreaField from '../components/ui/TextAreaField'

const LostFormPage = () => {
  const navigate = useNavigate()

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold bg-gradient-to-r from-primary via-secondary to-purple-600 bg-clip-text text-transparent">Raise a lost query</h1>
        <p className="text-sm text-neutral-600">Provide details so the community can watch out for your item.</p>
      </header>

      <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
        <InputField label="Item title" name="title" placeholder="e.g. Black leather wallet" required />
        <SelectField label="Category" name="category" defaultValue="" required>
          <option value="" disabled>
            Select category
          </option>
          <option value="Electronics">Electronics</option>
          <option value="Bags">Bags</option>
          <option value="Accessories">Accessories</option>
          <option value="Keys">Keys</option>
          <option value="Documents">Documents</option>
        </SelectField>
        <InputField label="Where did you lose it?" name="location" placeholder="Near Block A cafeteria" required />
        <InputField label="When was it lost?" name="lostAt" type="datetime-local" required />
        <TextAreaField
          label="Description & identifiers"
          name="description"
          placeholder="Colors, marks, contents, etc."
          required
        />
        <InputField label="Reward (optional)" name="reward" placeholder="Coffee treat for the finder" />

        <div className="flex gap-3">
          <Button type="submit" size="lg" className="flex-1">
            Submit lost query
          </Button>
          <Button type="button" variant="ghost" size="lg" className="flex-1" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>
    </section>
  )
}

export default LostFormPage
