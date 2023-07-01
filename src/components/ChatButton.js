import React from 'react';

function ChatButton({ mode, selectedChat, changeMode, picture = 'pictures/blankprofile.png' }) {
  const isSelected = mode === selectedChat;
  const activeClasses = isSelected ? 'bg-blue-500 text-white' : 'bg-white text-gray-900 hover:bg-gray-200';
  const containerClasses = `flex flex-row items-center p-3 cursor-pointer ${activeClasses} active:bg-blue-500 active:text-white rounded-lg`;

  return (
    <div className={containerClasses} onClick={() => changeMode(mode)}>
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-300 mr-3">
        <img src={picture} alt="Profile" className="w-full h-full rounded-full object-cover" />
      </div>
      <div className="flex-grow truncate">
        <div className="flex flex-row justify-between ">
          <h2 className="font-bold text-lg">{mode}</h2>
          <p className="text-sm">12:34 PM</p>
        </div>
        <p className="text-sm truncate text-left">Hi there!</p>
      </div>
    </div>
  );
}

export default ChatButton;