'use client'
import { useState, useRef, useEffect } from 'react'

type Message = {
  role: 'user' | 'bot'
  text: string
  suggestions?: string[]
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Bonjour ! Je suis l\'assistant du club. Comment puis-je vous aider ?', suggestions: [
      'Quels sont les horaires ?',
      'Comment s\'inscrire ?',
      'À partir de quel âge ?',
      'Stages pendant les vacances ?',
    ] },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { role: 'user', text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        role: 'bot',
        text: data.reply,
        suggestions: data.suggestions,
      }])
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Erreur de connexion. Réessayez.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Fermer le chat' : 'Ouvrir le chat'}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 8000,
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1d6fa4, #2eb8e6)',
          color: '#fff', border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(29,111,164,.4)',
          fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .2s',
        }}
      >
        {open ? '\u2715' : '\u{1F4AC}'}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 92, right: 24, zIndex: 8000,
          width: 360, maxHeight: 500,
          background: '#fff', borderRadius: 16,
          boxShadow: '0 8px 40px rgba(0,0,0,.15)',
          border: '1px solid #e2e8f0',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          animation: 'chatIn .2s ease',
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #0a1628, #1d6fa4)',
            padding: '16px 20px', color: '#fff',
          }}>
            <div style={{ fontWeight: 700, fontSize: '.95rem' }}>Assistant du club</div>
            <div style={{ fontSize: '.72rem', opacity: .6 }}>Reponse instantanee a vos questions</div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '16px',
            display: 'flex', flexDirection: 'column', gap: 12,
            maxHeight: 340, minHeight: 200,
          }}>
            {messages.map((msg, i) => (
              <div key={i}>
                <div style={{
                  maxWidth: '85%',
                  padding: '10px 14px', borderRadius: 12,
                  fontSize: '.85rem', lineHeight: 1.5,
                  ...(msg.role === 'user'
                    ? { marginLeft: 'auto', background: '#1d6fa4', color: '#fff', borderBottomRightRadius: 4 }
                    : { background: '#f1f5f9', color: '#1e293b', borderBottomLeftRadius: 4 }
                  ),
                }}>
                  {msg.text}
                </div>
                {msg.suggestions && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {msg.suggestions.map((s, j) => (
                      <button key={j} onClick={() => send(s)} style={{
                        padding: '5px 12px', borderRadius: 16,
                        background: 'rgba(29,111,164,.08)', border: '1px solid rgba(29,111,164,.2)',
                        color: '#1d6fa4', fontSize: '.72rem', fontWeight: 600,
                        cursor: 'pointer', transition: 'all .15s',
                      }}>{s}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ padding: '10px 14px', background: '#f1f5f9', borderRadius: 12, width: 'fit-content', fontSize: '.85rem', color: '#94a3b8' }}>
                ...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '12px 16px', borderTop: '1px solid #e2e8f0',
            display: 'flex', gap: 8,
          }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send(input)}
              placeholder="Posez votre question..."
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 8,
                border: '1px solid #e2e8f0', fontSize: '.85rem',
                outline: 'none',
              }}
            />
            <button onClick={() => send(input)} disabled={loading || !input.trim()} style={{
              padding: '8px 16px', borderRadius: 8,
              background: input.trim() ? '#1d6fa4' : '#e2e8f0',
              color: input.trim() ? '#fff' : '#94a3b8',
              border: 'none', fontWeight: 600, fontSize: '.85rem',
              cursor: input.trim() ? 'pointer' : 'default',
            }}>&#8593;</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatIn {
          from { opacity: 0; transform: translateY(16px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  )
}
