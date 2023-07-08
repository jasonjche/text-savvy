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
    setNewMessage('');
    setConvo(prevConvo => [...prevConvo, { message: newMessage, response: null }]);
    const response = await fetch('http://localhost:3001/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        promptScorer: selectedChat,
        promptResponder: selectedChat,
        message: newMessage }),
    }).then(res => res.json())
    setFeedbackModal(response.jsonObject);
    setConvo(prevConvo => {
      const convoCopy = [...prevConvo];
      convoCopy[convoCopy.length - 1].response = response.message;
      return convoCopy;
    });
  };

  const resetConvo = () => {
    setConvo([]);
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
    const promptScorer = dummyData.find(chat => chat.mode === mode).promptScorer;
    const promptResponder = dummyData.find(chat => chat.mode === mode).promptResponder;
    fetch('http://localhost:3001/changeMode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ promptScorer, promptResponder }),
    }).then(res => res.json())
  };

  return (
    <div className="text-center flex flex-row h-screen bg-gray-100 px-2 py-4 space-x-3 overflow-hidden">
      <div className='flex flex-col w-1/4 space-y-2'>
        <h1 className="text-left text-4xl font-bold tracking-tight text-gray-900 sm:text-3xl">Text-Savvy</h1>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={resetConvo}>Reset</button>
        <ChatButtonList chatModes={dummyData} selectedChat={selectedChat} changeMode={changeMode} />
      </div>
      <div className='flex flex-col w-3/4'>
        <Banner jsonObject={feedbackModal} closeBanner={closeBanner} />
        <div className="flex-grow flex flex-col overflow-y-scroll">
          <Convo convo={convo} />
          <div className="mt-auto">
            <MessageForm newMessage={newMessage} setNewMessage={setNewMessage} handleSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
