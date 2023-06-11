import React from 'react';

function ChatButton({ mode, selectedChat, changeMode }) {
    return (
        <button 
            className={`text-white font-bold py-2 ${selectedChat === mode ? "bg-blue-500" : "bg-gray-500 hover:bg-gray-700"}`} 
            onClick={() => changeMode(mode)}
        >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
        </button>
    )
}

export default ChatButton;
