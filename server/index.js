// server/index.js
import express from 'express'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import cors from 'cors'
import { networkInterfaces } from 'os'

// Function to get local IP address
function getLocalIP() {
  const nets = networkInterfaces()
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address
      }
    }
  }
  return 'localhost'
}

const app = express()
app.use(express.json())
app.use(cors())

// Database initialization
let db;
async function initializeDB() {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  })

  await db.exec(`
    CREATE TABLE IF NOT EXISTS counter (
      id INTEGER PRIMARY KEY,
      value INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      count INTEGER NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    INSERT OR IGNORE INTO counter (id, value) VALUES (1, 0);
  `)
}

// Initialize database
initializeDB().catch(console.error)

// Get current counter value
app.get('/api/counter', async (req, res) => {
  try {
    const row = await db.get('SELECT value FROM counter WHERE id = 1')
    res.json({ count: row.value })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Increment counter
app.post('/api/counter/increment', async (req, res) => {
  try {
    await db.run('BEGIN TRANSACTION')
    
    // Increment counter
    await db.run('UPDATE counter SET value = value + 1 WHERE id = 1')
    
    // Get new value
    const { value } = await db.get('SELECT value FROM counter WHERE id = 1')
    
    // Log the increment
    await db.run(
      'INSERT INTO logs (count) VALUES (?)',
      value
    )
    
    await db.run('COMMIT')
    
    res.json({ count: value })
  } catch (error) {
    await db.run('ROLLBACK')
    res.status(500).json({ error: error.message })
  }
})

// Get logs
app.get('/api/logs', async (req, res) => {
  try {
    const logs = await db.all('SELECT * FROM logs ORDER BY timestamp DESC')
    res.json(logs)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

const PORT = process.env.PORT || 6020
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Network access: http://${getLocalIP()}:${PORT}`)
})