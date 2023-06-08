import React from 'react';

export default function MessageForm({ newMessage, setNewMessage, handleSubmit }) {
  return (
    <form onSubmit={handleSubmit} className="flex">
      <textarea
        className="flex-grow mr-2 py-2 px-3 rounded bg-white shadow-inner resize-none"
        rows="1"
        placeholder='Type a message...'
        value={newMessage}
        onChange={e => setNewMessage(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <button type='submit' className="py-2 px-6 rounded bg-blue-500 text-white">
        Submit
      </button>
    </form>
  );
}
