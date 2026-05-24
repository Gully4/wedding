import type { Message } from '../lib/supabase'
import { Bot, User } from 'lucide-react'

type Props = {
  message: Message
}

export function ChatMessage({ message }: Props) {
  const isBot = message.role === 'assistant'

  return (
    <div className={`chat-message ${isBot ? 'bot' : 'user'}`}>
      <div className="avatar">
        {isBot ? <Bot size={18} /> : <User size={18} />}
      </div>
      <div className="bubble">
        <p>{message.content}</p>
      </div>
    </div>
  )
}
