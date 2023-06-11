import React from 'react';

export default function MessageBubble({ text }) {
  return (
    <div className="relative bg-blue-600 text-white p-3 inline-block bubble-sender text-right">
      {text}
    </div>
  );
}
