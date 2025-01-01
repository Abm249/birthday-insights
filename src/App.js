import React, { useState } from 'react';

function App() {
  const [date, setDate] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Selected date:', date);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to Birthday Insights</h1>
      <p>Enter your birthday to discover fun facts and insights!</p>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button type="submit">Get Insights</button>
      </form>
    </div>
  );
}

export default App;