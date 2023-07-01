import React from 'react';
import ChatButton from './ChatButton';

function ChatButtonList({ chatModes, selectedChat, changeMode }) {
  return (
    <div className="flex flex-col overflow-y-auto bg-white rounded-lg pr-3">
      {chatModes.map(chat => (
        <ChatButton key={chat.mode} mode={chat.mode} selectedChat={selectedChat} changeMode={changeMode} />
      ))}
    </div>
  );
}

export default ChatButtonList;