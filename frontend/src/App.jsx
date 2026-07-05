import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://15.207.19.127:5000/api/tickets';

function App() {
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Fetch all tickets
  const fetchTickets = async () => {
    try {
      const response = await axios.get(API_URL);
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Submit a new ticket
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return;

    try {
      await axios.post(API_URL, { title, description });
      setTitle('');
      setDescription('');
      fetchTickets(); // Refresh list
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  // Update ticket status
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/${id}`, { status: newStatus });
      fetchTickets(); // Refresh list
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🎫 Customer Support Ticket System</h1>
      
      {/* Ticket Creation Form */}
      <div style={{ background: '#f4f4f9', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>Submit a New Ticket</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <input 
              type="text" 
              placeholder="Ticket Title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <textarea 
              placeholder="Describe your issue..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', height: '80px' }}
              required
            />
          </div>
          <button type="submit" style={{ padding: '10px 15px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Submit Ticket
          </button>
        </form>
      </div>

      {/* Tickets List */}
      <h3>Active Tickets</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#333', color: '#fff' }}>
            <th style={{ padding: '10px' }}>ID</th>
            <th style={{ padding: '10px' }}>Title</th>
            <th style={{ padding: '10px' }}>Description</th>
            <th style={{ padding: '10px' }}>Status</th>
            <th style={{ padding: '10px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{ticket.id}</td>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{ticket.title}</td>
              <td style={{ padding: '10px' }}>{ticket.description}</td>
              <td style={{ padding: '10px' }}>
                <span style={{
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  fontSize: '12px',
                  color: '#fff',
                  background: ticket.status === 'Open' ? '#dc3545' : ticket.status === 'In Progress' ? '#ffc107' : '#28a745'
                }}>
                  {ticket.status}
                </span>
              </td>
              <td style={{ padding: '10px' }}>
                <select 
                  value={ticket.status} 
                  onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                  style={{ padding: '5px', borderRadius: '4px' }}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
