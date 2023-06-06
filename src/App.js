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
      body: JSON.stringify({ message })
    })
      .then(response => response.json())
      .then(data => setResponse(data.message))
  };

  return (
    <div className="App">
      <h1>Text-Savvy</h1>
      <textarea rows="10" cols="35" placeholder="Enter your text here"></textarea>
      <button onClick={handleSubmit}>Submit</button>
      <p>Response here</p>
    </div>
  );
}

export default App;
