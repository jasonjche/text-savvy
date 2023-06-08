import React from 'react';

export default function ResponseBubble({ text }) {
  if (text === null) {
    return null;
  }
  return (
    <div className="relative bg-gray-200 text-black p-2 inline-block bubble-receiver">
      {text}
    </div>
  );
}
