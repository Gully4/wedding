import { Bot } from 'lucide-react'

export function TypingIndicator() {
  return (
    <div className="chat-message bot">
      <div className="avatar">
        <Bot size={18} />
      </div>
      <div className="bubble typing">
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}
