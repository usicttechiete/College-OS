import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

const NotFoundPage = () => {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-purple-600">404</p>
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Page not found</h1>
        <p className="text-sm text-neutral-600">
          Looks like this trail is missing. Navigate back to safety and keep reuniting items with their owners.
        </p>
      </div>
      <Button variant="secondary" size="lg" iconLeft={<span>🏠</span>}>
        <Link to="/home">Return to home</Link>
      </Button>
    </section>
  )
}

export default NotFoundPage
