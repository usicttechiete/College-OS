import { MessageSquare, Send } from 'lucide-react'
import Button from '../components/ui/Button'
import { mockThreads } from '../data/messages'

const MessagesPage = () => {
  return (
    <section className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-brand-foreground)]">Messages</h1>
          <p className="text-sm text-[var(--color-muted)]">Coordinate handovers with finders and claimants.</p>
        </div>
        <MessageSquare className="size-6 text-[var(--color-brand)]" />
      </header>

      <div className="space-y-3">
        {mockThreads.map((thread) => (
          <article key={thread.id} className="rounded-3xl bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-[var(--color-brand-foreground)]">{thread.peerName}</h2>
                <p className="text-xs text-[var(--color-muted)]">Regarding {thread.itemTitle}</p>
              </div>
              {thread.unreadCount > 0 && (
                <span className="rounded-full bg-[var(--color-brand)] px-3 py-1 text-xs font-semibold text-white">
                  {thread.unreadCount} new
                </span>
              )}
            </div>
            <p className="mt-3 text-sm text-[var(--color-muted)]">“{thread.lastMessage}”</p>
            <div className="mt-4 flex items-center justify-between text-xs text-[var(--color-muted)]">
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
