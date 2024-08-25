import React from 'react';

const CoinflipResult = ({ result }) => {
  return (
    result && (
      <div className="text-2xl mt-4">
        Result: <span className="font-bold">{result}</span>
      </div>
    )
  );
};

export default CoinflipResult;
