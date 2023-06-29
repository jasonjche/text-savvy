import React from 'react';

function ChatButton({ mode, selectedChat, changeMode }) {
  const isSelected = mode === selectedChat;
  return (
    <div
      className={`flex flex-row items-center p-3 cursor-pointer ${isSelected ? 'bg-blue-500 text-white rounded-lg' : 'bg-white text-gray-900'} hover:bg-gray-200 hover:rounded-lg`}
      onClick={() => changeMode(mode)}
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-300 mr-3"></div>
      <div className="flex-grow truncate">
        <div className="flex flex-row justify-between ">
          <h2 className="font-bold text-lg">{mode}</h2>
          <p className="text-sm">12:34 PM</p>
        </div>
        <p className="text-sm truncate text-left">{isSelected ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' : 'Hi there!'}</p>
      </div>
    </div>
  );
}

export default ChatButton;