import React, { useState } from 'react';
import './App.css';


function App() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    fetch('http://localhost:3001/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message }), 
    })
      .then((res) => res.json())
      .then((data) => setResponse(data.message))
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <h1>Text-Savvy</h1>
        <textarea
          rows="10"
          cols="35"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button type='submit'>Submit</button>
        <p>{response}</p>
      </form>
    </div>
  );
}

export default App;
