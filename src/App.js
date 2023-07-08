import React, { useEffect, useState } from 'react';
import Banner from './components/Banner';
import Convo from './components/Convo';
import MessageForm from './components/MessageForm';
import ChatButtonList from './components/ChatButtonList';

function App() {
  const [newMessage, setNewMessage] = useState("");
  const [convo, setConvo] = useState([]);
  const [jsonObject, setJsonObject] = useState(null);
  const [selectedChat, setSelectedChat] = useState("Friend");

  const lol = 'You are a rater of my text messages to a girl. Rate it on a scale of 1 to 10, and give me a reasoning as to why I got that message. Assume my goal is to become closer with this girl and potentially get in a relationship. Return your examples in a json object with keys "score" and "reason". Do not add any additional commentary besides the json. \n\nExample:\n\nInput:\nPrevious Message: how are you\nMy Message: good, how was your day tho?\n\nOutput:\n{\n"score": "7",\n"reason": "You were too direct and potentially acting too fast. That previous message maybe wanted you to talk about yourself"\n}';
  const lol2 = 'You are a rater of my text messages to an angry coworker. Rate it on a scale of 1 to 10, and give me a reasoning as to why I got that message. Assume my goal is to finish the project with an impending deadline while maintaining a good relationship. Return your examples in a json object with keys "score" and "reason". Do not add any additional commentary besides the json. \n\nExample:\n\nInput:\nPrevious Message: how are you\nMy Message: good, how was your day tho?\n\nOutput:\n{\n"score": "7",\n"reason": "You were too direct and potentially acting too fast. That previous message maybe wanted you to talk about yourself"\n}';
  const test = [
    {
      "mode": "Friend",
      "promptScorer": lol,
      "promptResponder": "You are a young adult female who is texting a guy that is interested in you. You are not interested in him and want to end the conversation. Text in lower case, use slang, emojis, abbreviations, short sentences, and gramatical errors to make the conversation more realistic (only use emojis when appropriate, not on every message). The conversation ends when he stops texting you. Act like a really dry texter and make it hard for him to figure out a response because your responses are so short. When you do not know the answer, simply say idk. Only respond with the next text in the sequence, assume the most recent text was from him",
    },
    {
      "mode": "Coworker",
      "promptScorer": lol2,
      "promptResponder": "You are a passive aggressive data science co-worker to a product manager. Write as if you are tired of responding to the product manager.",
    }
  ];

  useEffect(() => {
    changeMode(selectedChat);
  }, []);

  const handleSubmit = async e => {
    if (newMessage === '') return;
    e.preventDefault();
    setNewMessage('');
    setConvo(prevConvo => [...prevConvo, { message: newMessage, response: null }]);
    const response = await fetch(process.env.REACT_APP_API_SITE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        promptScorer: selectedChat,
        promptResponder: selectedChat,
        message: newMessage }),
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
    setConvo([]);
    setJsonObject(null);
    const promptScorer = test.find(chat => chat.mode === mode).promptScorer;
    const promptResponder = test.find(chat => chat.mode === mode).promptResponder;
    fetch(process.env.REACT_APP_API_SITE + 'changeMode', {
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
        <ChatButtonList chatModes={test} selectedChat={selectedChat} changeMode={changeMode} />
      </div>
      <div className='flex flex-col w-3/4'>
        <Banner jsonObject={jsonObject} closeBanner={closeBanner} />
        <div className="flex-grow flex flex-col">
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
