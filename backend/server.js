const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// GET: Fetch all tickets
app.get('/api/tickets', (req, res) => {
    db.query('SELECT * FROM tickets ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// POST: Create a new ticket
app.post('/api/tickets', (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }
    db.query('INSERT INTO tickets (title, description) VALUES (?, ?)', [title, description], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, title, description, status: 'Open' });
    });
});

// PUT: Update ticket status
app.put('/api/tickets/:id', (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    db.query('UPDATE tickets SET status = ? WHERE id = ?', [status, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Ticket status updated successfully' });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
