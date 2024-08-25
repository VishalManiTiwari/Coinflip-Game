import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram, Connection, clusterApiUrl } from '@solana/web3.js';
import WalletConnectButton from './WalletConnectButton';
import BetForm from './BetForm';
import CoinflipResult from './CoinflipResult';

const TREASURY_PUBLIC_KEY = new PublicKey('2PmyuJ9FxC4Q1jZB8tdLbRc4rfyzYzpm9AzT8i6DsnAA');
const connection = new Connection(clusterApiUrl('devnet'));

const CoinflipGame = () => {
  const { publicKey, sendTransaction } = useWallet();
  const [betAmount, setBetAmount] = useState(0.1);
  const [sideChosen, setSideChosen] = useState('heads');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const flipCoin = () => (Math.random() < 0.5 ? 'heads' : 'tails');

  const handleFlip = async () => {
    if (!publicKey) {
      setMessage('Please connect your wallet.');
      return;
    }

    setMessage('');
    setIsLoading(true);
    const flipResult = flipCoin();
    setResult(flipResult);

    try {
      if (flipResult === sideChosen) {
        await payoutUser(betAmount);
        setMessage('Congratulations! You won the bet.');
      } else {
        await sendToTreasury(betAmount);
        setMessage('Sorry, you lost the bet.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Transaction failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const payoutUser = async (amount) => {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: TREASURY_PUBLIC_KEY,
        toPubkey: publicKey,
        lamports: amount * 2 * 1e9,
      })
    );

    await sendTransaction(transaction, connection);
    console.log('Payout successful');
  };

  const sendToTreasury = async (amount) => {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: TREASURY_PUBLIC_KEY,
        lamports: amount * 1e9,
      })
    );

    await sendTransaction(transaction, connection);
    console.log('Sent to treasury');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Header Section */}
      <header className="bg-gray-800 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Solana Coinflip Game</h1>
          <WalletConnectButton />
        </div>
      </header>

      {/* Main Content Section */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6">
          <BetForm
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            sideChosen={sideChosen}
            setSideChosen={setSideChosen}
          />
          {message && <p className="text-lg text-blue-400 mb-4 text-center">{message}</p>}
          <button
            onClick={handleFlip}
            className={`w-full py-3 bg-green-500 rounded-md text-lg font-semibold hover:bg-green-600 transition-colors duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Flip Coin'}
          </button>
          <CoinflipResult result={result} />
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-800 p-4 text-center">
        <p className="text-sm text-gray-400">© 2024 Coinflip Game. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CoinflipGame;
