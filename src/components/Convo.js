import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import ResponseBubble from './ResponseBubble';

export default function Convo({ convo }) {
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [convo]);

  return (
    <div className="flex flex-col overflow-y-scroll mb-4">
      {convo.map((item, index) => (
        <React.Fragment key={index}>
          <MessageBubble text={item.message} />
          <ResponseBubble text={item.response} />
        </React.Fragment>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
}
