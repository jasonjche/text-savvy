import React from 'react';
import MessageBubble from './MessageBubble';
import ResponseBubble from './ResponseBubble';

export default function Convo({ convo }) {
  return (
    <div className="flex flex-col overflow-auto mb-4">
      {convo.map((item, index) => (
        <React.Fragment key={index}>
          <MessageBubble text={item.message} />
          <ResponseBubble text={item.response} />
        </React.Fragment>
      ))}
    </div>
  );
}
