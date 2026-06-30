import { useState } from 'react'

const API_BASE = 'http://localhost:8000'

function Nav({ page, setPage }) {
  const items = [
    { id: 'upload', label: 'Upload' },
    { id: 'chat', label: 'Chat' },
    { id: 'documents', label: 'Documents' },
  ]
  return (
    <nav className="bg-white border-b border-teal-100 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-sm">
            M
          </div>
          <span className="font-semibold text-teal-900">MedJourney AI</span>
        </div>
        <div className="flex gap-1">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                page === item.id
                  ? 'bg-teal-600 text-white'
                  : 'text-teal-700 hover:bg-teal-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

function UploadPage() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (!file) {
      setStatus('Please choose a PDF file first.')
      setError(true)
      return
    }
    setLoading(true)
    setStatus('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      setStatus(`"${data.filename}" uploaded successfully — ${data.chunks_created} chunks created.`)
      setError(false)
    } catch (err) {
      setStatus('Something went wrong, please try again.')
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-10">
        <h1 className="text-2xl font-semibold text-teal-900 mb-1">Upload a Document</h1>
        <p className="text-base text-gray-500 mb-8">Add a PDF to your health record so you can ask questions about it.</p>
        <label className="block border-2 border-dashed border-teal-200 rounded-xl p-10 text-center cursor-pointer hover:bg-teal-50 transition mb-6">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
          <p className="text-base text-teal-700 font-medium">
            {file ? file.name : 'Click to choose a PDF'}
          </p>
        </label>
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-xl disabled:opacity-50 transition text-base"
        >
          {loading ? 'Uploading...' : 'Upload Document'}
        </button>
        {status && (
          <p className={`mt-4 text-sm rounded-lg px-4 py-3 ${error ? 'bg-red-50 text-red-600' : 'bg-teal-50 text-teal-700'}`}>
            {status}
          </p>
        )}
      </div>
    </div>
  )
}

function ChatPage() {
  const [messages, setMessages] = useState([])
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!question.trim()) return
    const userMessage = { role: 'user', text: question }
    setMessages((prev) => [...prev, userMessage])
    setQuestion('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage.text }),
      })
      if (!res.ok) throw new Error('Chat failed')
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', text: data.answer }])
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Something went wrong, please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col h-[80vh]">
      <h1 className="text-2xl font-semibold text-teal-900 mb-1">Ask About Your Documents</h1>
      <p className="text-base text-gray-500 mb-6">Answers are based only on what you've uploaded.</p>
      <div className="flex-1 overflow-y-auto bg-white rounded-2xl border border-teal-100 p-6 mb-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-base text-gray-400 text-center mt-10">Ask a question to get started.</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <span
              className={`inline-block rounded-2xl px-5 py-3 max-w-[80%] text-base ${
                m.role === 'user' ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-900'
              }`}
            >
              {m.text}
            </span>
          </div>
        ))}
        {loading && <p className="text-sm text-gray-400">Thinking...</p>}
      </div>
      <div className="flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
          className="flex-1 border border-teal-200 rounded-full px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
        <button
          onClick={handleSend}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-full text-base font-medium transition"
        >
          Send
        </button>
      </div>
    </div>
  )
}

function DocumentsPage() {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)

  useState(() => {
    fetch(`${API_BASE}/documents`)
      .then((res) => res.json())
      .then((data) => setDocs(data.documents || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold text-teal-900 mb-1">Your Documents</h1>
      <p className="text-base text-gray-500 mb-8">Everything you've uploaded so far.</p>
      {loading ? (
        <p className="text-base text-gray-400">Loading...</p>
      ) : docs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-teal-100 p-10 text-center text-base text-gray-400">
          No documents uploaded yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {docs.map((d, i) => (
            <li key={i} className="bg-white rounded-2xl border border-teal-100 px-6 py-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 text-sm font-semibold">
                PDF
              </div>
              <div>
                <p className="font-medium text-teal-900 text-base">{d.filename}</p>
                <p className="text-sm text-gray-400">{new Date(d.uploaded_at).toLocaleString()}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function App() {
  const [page, setPage] = useState('upload')
  return (
    <div className="min-h-screen bg-teal-50/40">
      <Nav page={page} setPage={setPage} />
      {page === 'upload' && <UploadPage />}
      {page === 'chat' && <ChatPage />}
      {page === 'documents' && <DocumentsPage />}
    </div>
  )
}

export default App