import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageCircle, X, Send, BookOpen, Globe, Loader2, FileText } from 'lucide-react'

interface Source {
  documentId: string
  displayName: string
  category: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
  isStreaming?: boolean
}

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [sourceMode, setSourceMode] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: "Hello! I'm the NDA Readiness assistant. Ask me anything about climate finance, the Green Climate Fund, or Eritrea's readiness programme.\n\nUse **Source Mode** to get answers from our official documents, or turn it off for general knowledge.",
      }])
    }
  }, [isOpen, messages.length])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSend = async () => {
    const question = input.trim()
    if (!question || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: question,
    }

    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: '',
      sources: [],
      isStreaming: true,
    }

    setMessages(prev => [...prev, userMessage, assistantMessage])
    setInput('')
    setIsLoading(true)

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
    }

    try {
      abortControllerRef.current = new AbortController()

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, sourceMode }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Something went wrong.' }))
        throw new Error(errorData.error || `Request failed (${response.status})`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response stream')

      const decoder = new TextDecoder()
      let buffer = ''
      let fullContent = ''
      let sources: Source[] = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || !trimmed.startsWith('data:')) continue

          const data = trimmed.slice(5).trim()
          try {
            const parsed = JSON.parse(data)

            if (parsed.type === 'sources') {
              sources = parsed.sources || []
              setMessages(prev =>
                prev.map(m =>
                  m.id === assistantMessage.id ? { ...m, sources } : m
                )
              )
            } else if (parsed.type === 'token') {
              fullContent += parsed.content
              setMessages(prev =>
                prev.map(m =>
                  m.id === assistantMessage.id ? { ...m, content: fullContent } : m
                )
              )
            } else if (parsed.type === 'error') {
              fullContent += `\n\n⚠️ ${parsed.error}`
              setMessages(prev =>
                prev.map(m =>
                  m.id === assistantMessage.id ? { ...m, content: fullContent } : m
                )
              )
            }
          } catch {
            // Skip malformed SSE data
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return

      const errorMessage = err instanceof Error ? err.message : 'Something went wrong.'
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantMessage.id
            ? { ...m, content: `Sorry, I encountered an error: ${errorMessage}`, isStreaming: false }
            : m
        )
      )
    } finally {
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantMessage.id ? { ...m, isStreaming: false } : m
        )
      )
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen
            ? 'bg-gray-700 hover:bg-gray-800'
            : 'bg-primary hover:bg-primary-dark'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-white rounded-2xl shadow-2xl border border-border-light flex flex-col overflow-hidden"
          style={{ height: 'min(560px, calc(100vh - 140px))' }}
        >
          {/* Header */}
          <div className="bg-primary px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-white" />
              <h3 className="font-heading text-white font-semibold text-base">
                NDA Assistant
              </h3>
            </div>

            {/* Source Mode Toggle */}
            <button
              onClick={() => setSourceMode(!sourceMode)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                sourceMode
                  ? 'bg-white/20 text-white hover:bg-white/30'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
              title={sourceMode ? 'Answers from documents' : 'General knowledge'}
            >
              {sourceMode ? (
                <>
                  <BookOpen className="w-3.5 h-3.5" />
                  Source Mode
                </>
              ) : (
                <>
                  <Globe className="w-3.5 h-3.5" />
                  General
                </>
              )}
            </button>
          </div>

          {/* Source Mode Indicator */}
          <div className={`px-4 py-1.5 text-xs font-body shrink-0 ${
            sourceMode
              ? 'bg-emerald-50 text-emerald-700 border-b border-emerald-100'
              : 'bg-gray-50 text-gray-500 border-b border-gray-100'
          }`}>
            {sourceMode
              ? '📚 Answers based on official documents'
              : '💬 General knowledge mode'
            }
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4" style={{ scrollbarWidth: 'thin' }}>
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed font-body ${
                  message.role === 'user'
                    ? 'bg-primary text-white rounded-br-md'
                    : 'bg-bg-secondary text-text-primary rounded-bl-md'
                }`}>
                  {/* Render content with basic formatting */}
                  <div className="whitespace-pre-wrap break-words">
                    {message.content.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={i}>{part.slice(2, -2)}</strong>
                      }
                      return <span key={i}>{part}</span>
                    })}
                    {message.isStreaming && (
                      <span className="inline-block w-1.5 h-4 bg-primary/60 ml-0.5 animate-pulse rounded-sm" />
                    )}
                  </div>

                  {/* Sources */}
                  {message.sources && message.sources.length > 0 && !message.isStreaming && (
                    <div className="mt-2.5 pt-2 border-t border-black/10">
                      <p className="text-[11px] font-medium text-text-muted mb-1.5">📎 Sources:</p>
                      <div className="space-y-1">
                        {message.sources.map((source, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[11px] text-text-secondary">
                            <FileText className="w-3 h-3 mt-0.5 shrink-0 text-primary" />
                            <span className="break-all">{source.displayName}</span>
                            <span className="text-text-muted shrink-0">({source.category})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="flex justify-start">
                <div className="bg-bg-secondary rounded-2xl rounded-bl-md px-3.5 py-2.5">
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border-light p-3 shrink-0 bg-white">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question..."
                rows={1}
                className="flex-1 resize-none rounded-xl border border-border-light bg-bg-primary px-3.5 py-2.5 text-sm font-body text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center transition-all duration-200 hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatBubble
