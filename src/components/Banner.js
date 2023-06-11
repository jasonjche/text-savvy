import React from 'react';

export default function Banner({ jsonObject, closeBanner }) {
  if (!jsonObject) return null;

  return (
    <div className={`z-50 fixed top-0 left-0 w-full text-white p-4 flex justify-between items-center space-x-4 ${jsonObject.score <= 4 ? 'bg-red-500' : jsonObject.score <= 7 ? 'bg-yellow-500' : 'bg-green-500'}`}>
      <div className="flex flex-col justify-center items-center">
        <h2 className="font-bold">Score: {jsonObject.score}</h2>
        <p>Reason: {jsonObject.reason}</p>
      </div>
      <div className="flex justify-end">
        <button onClick={closeBanner} className="bg-white text-black p-2 rounded">Close</button>
      </div>
    </div>
  );
}
