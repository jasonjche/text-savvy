import React, { useState } from 'react';
import './App.css';

function MessageBubble({ text }) {
  return (
    <div className="bubble-sender">
      {text}
    </div>
  );
}

function ResponseBubble({ text }) {
  return (
    <div className="bubble-receiver">
      {text}
    </div>
  );
}

function App() {
  const [newMessage, setNewMessage] = useState("");
  const [convo, setConvo] = useState([]);

  const handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('http://localhost:3001/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: newMessage }), 
    }).then(res => res.json())

    setConvo([...convo, { message: newMessage, response: response.message }]);
    setNewMessage('');
  };

  return (
    <div className="App flex flex-col justify-between h-screen bg-gray-100 p-5">
      <h1 className="text-3xl mb-4">Text-Savvy</h1>
      <div className="flex flex-col overflow-auto mb-4">
        {convo.map((item, index) => (
          <React.Fragment key={index}>
            <MessageBubble text={item.message} />
            <ResponseBubble text={item.response} />
          </React.Fragment>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <textarea
          className="flex-grow mr-2 py-2 px-3 rounded bg-white shadow-inner resize-none"
          rows="1"
          placeholder='Type a message...'
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
        />
        <button type='submit' className="py-2 px-6 rounded bg-blue-500 text-white">
          Submit
        </button>
      </form>
    </div>
  );
}

export default App;
