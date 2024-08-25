import React from "react";

const BetForm = ({ betAmount, setBetAmount, sideChosen, setSideChosen }) => {
  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 rounded-lg shadow-lg max-w-sm mx-auto">
      <h2 className="text-2xl font-semibold text-white mb-6">Place Your Bet</h2>
      <label className="text-lg text-white mb-4 flex flex-col">
        Bet Amount (in SOL):
        <input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(Number(e.target.value))}
          className="mt-2 p-3 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
      </label>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setSideChosen("heads")}
          className={`px-6 py-3 rounded-md font-medium text-white transition duration-300 ${
            sideChosen === "heads" ? "bg-blue-600 shadow-lg" : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          <img
            className="rounded-full"
            src="https://tse2.mm.bing.net/th?id=OIP.hn2gZV90k3POf8JlWA5EgwHaHa&pid=Api&P=0&h=180"
            alt="Heads"
          />
        </button>
        <button
          onClick={() => setSideChosen("tails")}
          className={`px-6 py-3 rounded-md font-medium text-white transition duration-300 ${
            sideChosen === "tails" ? "bg-blue-600 shadow-lg" : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          <img
            className="rounded-full"
            src="https://tse2.mm.bing.net/th?id=OIP.UOu_C3Vk0MliRUZdiMp7KgHaHa&pid=Api&P=0&h=180"
            alt="Tails"
          />
        </button>
      </div>
    </div>
  );
};

export default BetForm;
