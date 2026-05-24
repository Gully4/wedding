import { useEffect, useRef, useState, useCallback } from 'react'
import { supabase, type Message } from './lib/supabase'
import { getSessionId } from './lib/session'
import { ChatMessage } from './components/ChatMessage'
import { TypingIndicator } from './components/TypingIndicator'
import { ChatInput } from './components/ChatInput'
import { MapPin, RefreshCw } from 'lucide-react'
import './App.css'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export default function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading, scrollToBottom])

  const initConversation = useCallback(async () => {
    setInitializing(true)
    setMessages([])
    const sessionId = getSessionId()

    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    let convId: string

    if (existing) {
      convId = existing.id
      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true })
      setMessages((msgs as Message[]) ?? [])
    } else {
      const { data: newConv } = await supabase
        .from('conversations')
        .insert({ session_id: sessionId })
        .select('id')
        .single()
      convId = newConv!.id

      const greeting: Omit<Message, 'id' | 'created_at'> = {
        conversation_id: convId,
        role: 'assistant',
        content: 'Halo! Saya Jalanan Bot. Tanyakan saya tentang kondisi jalan, kemacetan, atau info lalu lintas. Saya siap membantu!',
      }
      const { data: greetMsg } = await supabase
        .from('messages')
        .insert(greeting)
        .select('*')
        .single()
      setMessages([greetMsg as Message])
    }

    setConversationId(convId)
    setInitializing(false)
  }, [])

  useEffect(() => {
    initConversation()
  }, [initConversation])

  async function handleNewChat() {
    sessionStorage.removeItem('jalanan_bot_session')
    await initConversation()
  }

  async function handleSend(text: string) {
    if (!conversationId) return
    setLoading(true)

    const userMsg: Omit<Message, 'id' | 'created_at'> = {
      conversation_id: conversationId,
      role: 'user',
      content: text,
    }
    const { data: savedUser } = await supabase
      .from('messages')
      .insert(userMsg)
      .select('*')
      .single()

    setMessages((prev) => [...prev, savedUser as Message])

    try {
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/jalanan-bot`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ message: text, conversationId }),
        }
      )

      const { reply } = await response.json()

      const botMsg: Omit<Message, 'id' | 'created_at'> = {
        conversation_id: conversationId,
        role: 'assistant',
        content: reply,
      }
      const { data: savedBot } = await supabase
        .from('messages')
        .insert(botMsg)
        .select('*')
        .single()

      setMessages((prev) => [...prev, savedBot as Message])
    } catch {
      const errMsg: Omit<Message, 'id' | 'created_at'> = {
        conversation_id: conversationId,
        role: 'assistant',
        content: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
      }
      const { data: savedErr } = await supabase
        .from('messages')
        .insert(errMsg)
        .select('*')
        .single()
      setMessages((prev) => [...prev, savedErr as Message])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <div className="header-icon">
            <MapPin size={22} />
          </div>
          <div>
            <h1>Jalanan Bot</h1>
            <span className="header-sub">Asisten Informasi Lalu Lintas</span>
          </div>
        </div>
        <button className="new-chat-btn" onClick={handleNewChat} title="Chat baru">
          <RefreshCw size={16} />
          <span>Chat Baru</span>
        </button>
      </header>

      <main className="chat-area">
        {initializing ? (
          <div className="init-loader">
            <div className="spinner" />
            <p>Memuat percakapan...</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {loading && <TypingIndicator />}
            <div ref={bottomRef} />
          </>
        )}
      </main>

      <footer className="chat-footer">
        <div className="quick-prompts">
          {['Kondisi jalan tol hari ini?', 'Kemacetan di Jakarta?', 'Rute alternatif?'].map((q) => (
            <button
              key={q}
              className="quick-prompt-btn"
              onClick={() => handleSend(q)}
              disabled={loading || initializing}
            >
              {q}
            </button>
          ))}
        </div>
        <ChatInput onSend={handleSend} disabled={loading || initializing} />
      </footer>
    </div>
  )
}
