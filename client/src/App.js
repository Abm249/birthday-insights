import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [date, setDate] = useState('');
  const [insights, setInsights] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the page from reloading
    try {
      const response = await axios.get(`http://localhost:5000/events?date=${date}`);
      setInsights(response.data); // Store the data from the server
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to Birthday Insights</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)} // Update date state
          required
        />
        <button type="submit">Get Insights</button>
      </form>
      {insights && (
        <div>
          <h2>Insights for {date}</h2>
          <pre>{JSON.stringify(insights, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
