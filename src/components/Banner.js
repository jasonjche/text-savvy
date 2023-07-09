import React from 'react';

export default function Banner({ feedback, closeBanner }) {
  if (!feedback) return null;

  return (
    <div className={`z-50 fixed top-0 left-0 w-full text-white p-4 flex justify-between items-center space-x-4 ${feedback.score <= 4 ? 'bg-red-500' : feedback.score <= 7 ? 'bg-yellow-500' : 'bg-green-500'}`}>
      <div className="flex flex-col justify-center items-center">
        <h2 className="font-bold">Score: {feedback.score}</h2>
        <p>Reason: {feedback.reason}</p>
      </div>
      <div className="flex justify-end">
        <button onClick={closeBanner} className="bg-white text-black p-2 rounded">Close</button>
      </div>
    </div>
  );
}
