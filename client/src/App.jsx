import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Counter from './components/Counter'
import Log from './components/Log'

const API_URL = '/api'

function App() {
  const [count, setCount] = useState(0)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch initial counter value
  useEffect(() => {
    fetchCounter()
    fetchLogs()
  }, [])

  const fetchCounter = async () => {
    try {
      const response = await fetch(`${API_URL}/counter`)
      const data = await response.json()
      if (response.ok) {
        setCount(data.count)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Failed to fetch counter')
    }
  }

  const fetchLogs = async () => {
    try {
      const response = await fetch(`${API_URL}/logs`)
      const data = await response.json()
      if (response.ok) {
        setLogs(data)
      } else {
        setError(data.error)
      }
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch logs')
      setLoading(false)
    }
  }

  const handleIncrement = async () => {
    try {
      const response = await fetch(`${API_URL}/counter/increment`, {
        method: 'POST',
      })
      const data = await response.json()
      if (response.ok) {
        setCount(data.count)
        fetchLogs() // Refresh logs after increment
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Failed to increment counter')
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg p-4">
          <div className="container mx-auto flex justify-between">
            <h1 className="text-2xl font-bold text-gray-800">KC Counter</h1>
            <div className="space-x-4">
              <Link to="/" className="text-blue-600 hover:text-blue-800">Counter</Link>
              <Link to="/log" className="text-blue-600 hover:text-blue-800">Log</Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route 
            path="/" 
            element={<Counter count={count} onIncrement={handleIncrement} />} 
          />
          <Route 
            path="/log" 
            element={<Log logs={logs} loading={loading} />} 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App