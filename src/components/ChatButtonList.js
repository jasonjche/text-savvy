import React from 'react';
import ChatButton from './ChatButton';

function ChatButtonList({ chatModes, selectedChat, changeMode }) {
  return (
    <div className="flex flex-col overflow-y-auto bg-white">
      {chatModes.map(mode => (
        <ChatButton key={mode} mode={mode} selectedChat={selectedChat} changeMode={changeMode} />
      ))}
    </div>
  );
}

export default ChatButtonList;