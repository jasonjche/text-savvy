import React, { useEffect, useState } from 'react';
import Banner from './components/Banner';
import Convo from './components/Convo';
import MessageForm from './components/MessageForm';
import ChatButtonList from './components/ChatButtonList';

const dummyData = require('./dummyData.js');

function App() {
  const [newMessage, setNewMessage] = useState("");
  const [convo, setConvo] = useState([]);
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [selectedChat, setSelectedChat] = useState("Friend");

  useEffect(() => {
    changeMode(selectedChat);
  }, []);

  const handleSubmit = async e => {
    if (newMessage === '') return;
    e.preventDefault();
    console.log(newMessage)
    setConvo(prevConvo => [...prevConvo, { message: newMessage, response: null }]);
    setNewMessage('');
    const response = await fetch('https://text-savvy-api.onrender.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mode: selectedChat,
        message: [...convo, { message: newMessage, response: null }]
      }),
    }).then(res => res.json())
    setFeedbackModal(response.feedback);
    setConvo(prevConvo => {
      const convoCopy = [...prevConvo];
      convoCopy[convoCopy.length - 1].response = response.message;
      return convoCopy;
    });
  };

  const resetConvo = () => {
    setConvo([]);
    localStorage.removeItem(selectedChat);
  };

  const resetAll = () => {
    setConvo([]);
    localStorage.clear();
  };

  const closeBanner = () => {
    setFeedbackModal(null);
  };

  const changeMode = (mode) => {
    localStorage.setItem(selectedChat, JSON.stringify(convo));
    console.log(localStorage.getItem(selectedChat));
    setSelectedChat(mode);
    localStorage.getItem(mode) !== null ? setConvo(JSON.parse(localStorage.getItem(mode))) : setConvo([]);
    setFeedbackModal(null);
  };

  return (
    <div className="text-center flex flex-row h-screen bg-gray-100 px-2 py-4 space-x-3 overflow-hidden">
      <div className='flex flex-col w-1/4 space-y-2'>
        <h1 className="text-left text-4xl font-bold tracking-tight text-gray-900 sm:text-3xl">Text-Savvy</h1>
        <div className="flex flex-row space-x-2">
          <button className="w-1/2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={resetConvo}>Reset</button>
          <button className="w-1/2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={resetAll}>Reset All</button>
        </div>
        <ChatButtonList chatModes={dummyData} selectedChat={selectedChat} changeMode={changeMode} />
      </div>
      <div className='flex flex-col w-3/4'>
        <Banner feedback={feedbackModal} closeBanner={closeBanner} />
        <div className="flex-grow flex flex-col overflow-y-scroll">
          <Convo convo={convo} />
          <MessageForm newMessage={newMessage} setNewMessage={setNewMessage} handleSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}

export default App;
