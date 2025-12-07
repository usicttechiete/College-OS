import { MessageSquare, Send } from 'lucide-react'
import Button from '../components/ui/Button'
import { mockThreads } from '../data/messages'

const MessagesPage = () => {
  return (
    <section className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">Messages</h1>
          <p className="text-sm text-neutral-600">Coordinate handovers with finders and claimants.</p>
        </div>
        <MessageSquare className="size-6 text-purple-500" />
      </header>

      <div className="space-y-3">
        {mockThreads.map((thread) => (
          <article key={thread.id} className="rounded-3xl bg-white p-5 shadow-soft border border-purple-200/50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-purple-600">{thread.peerName}</h2>
                <p className="text-xs text-neutral-600">Regarding {thread.itemTitle}</p>
              </div>
              {thread.unreadCount > 0 && (
                <span className="rounded-full bg-gradient-to-r from-primary via-accent to-secondary px-3 py-1 text-xs font-semibold text-white shadow-soft">
                  {thread.unreadCount} new
                </span>
              )}
            </div>
            <p className="mt-3 text-sm text-neutral-600">"{thread.lastMessage}"</p>
            <div className="mt-4 flex items-center justify-between text-xs text-neutral-600">
              <time>
                {new Date(thread.timestamp).toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </time>
              <Button variant="secondary" size="md" iconRight={<Send className="size-4" />}>
                Open chat
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default MessagesPage
