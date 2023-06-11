import React from 'react';

function Sidebar({chats, setSelectedChat}) {
    return (
        <div className="flex flex-col w-1/4 h-full bg-gray-200 p-5">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Text-Savvy</h1>
            <div className="flex flex-col mt-5">
                <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">Chats</h2>
                <div className="flex flex-col mt-5">
                    {chats.map((chat, index) => (
                        <div key={index} className="flex flex-row justify-between items-center p-2 border-b border-gray-400 cursor-pointer hover:bg-gray-300" onClick={() => setSelectedChat(chat)}>
                            <div className="flex flex-col">
                                <h3 className="text-lg font-bold tracking-tight text-gray-900 sm:text-xl">{chat.name}</h3>
                                <p className="text-sm text-gray-700">{chat.description}</p>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-sm text-gray-700">{chat.messages.length} messages</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Sidebar;