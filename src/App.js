import React, { useState } from 'react';
import Banner from './components/Banner';
import Convo from './components/Convo';
import ChatButton from './components/ChatButton';
import MessageForm from './components/MessageForm';

function App() {
  const [newMessage, setNewMessage] = useState("");
  const [convo, setConvo] = useState([]);
  const [jsonObject, setJsonObject] = useState(null);
  const [selectedChat, setSelectedChat] = useState("null");

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

  const changeMode = (mode) => {
    setSelectedChat(mode);
    fetch('http://localhost:3001/changeMode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ mode }),
    }).then(res => res.json())
  };

  return (
    <div className="text-center flex flex-row h-screen bg-gray-100 p-5">
      <div className='flex flex-col w-1/4 bg-gray-300'>
        <ChatButton mode="mom" selectedChat={selectedChat} changeMode={changeMode} />
        <ChatButton mode="friend" selectedChat={selectedChat} changeMode={changeMode} />
      </div>
      <div className='flex flex-col w-3/4'>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Text-Savvy</h1>
        <Banner jsonObject={jsonObject} closeBanner={closeBanner} />
        <div className="">
          <Convo convo={convo} />
          <MessageForm newMessage={newMessage} setNewMessage={setNewMessage} handleSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}

export default App;
