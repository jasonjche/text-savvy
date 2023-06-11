import React, { useState } from 'react';
import Banner from './components/Banner';
import Convo from './components/Convo';
import MessageForm from './components/MessageForm';
import Sidebar from './components/Sidebar';

function App() {
  const [newMessage, setNewMessage] = useState("");
  const [convo, setConvo] = useState([]);
  const [jsonObject, setJsonObject] = useState(null);
  //const [selectedChat, setSelectedChat] = useState("null");

  const handleSubmit = async e => {
    if (newMessage === '') return;
    e.preventDefault();
    setNewMessage('');
    setConvo(prevConvo => [...prevConvo, { message: newMessage, response: null }]);
    const response = await fetch('http://localhost:3001/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: newMessage }),
    }).then(res => res.json())
    setJsonObject(response.jsonObject);
    setConvo(prevConvo => {
      const convoCopy = [...prevConvo];
      convoCopy[convoCopy.length - 1].response = response.message;
      return convoCopy;
    });
  };

  const closeBanner = () => {
    setJsonObject(null);
  };

  const changeMode = () => {
    fetch ('http://localhost:3001/changeMode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({}),
    }).then(res => res.json())
  };

  return (
    <div className="text-center flex flex-col justify-between h-screen bg-gray-100 p-5">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Text-Savvy</h1>
      <Banner jsonObject={jsonObject} closeBanner={closeBanner} />
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={changeMode}>Change</button>
      <Convo convo={convo} />
      <MessageForm newMessage={newMessage} setNewMessage={setNewMessage} handleSubmit={handleSubmit} />
    </div>
  );
}

export default App;
