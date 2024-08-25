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
        lamports: amount * 2 * 1e9, // Convert SOL to lamports
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
        lamports: amount * 1e9, // Convert SOL to lamports
      })
    );

    await sendTransaction(transaction, connection);
    console.log('Sent to treasury');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Solana Coinflip Game</h1>
      <WalletConnectButton />
      <BetForm
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        sideChosen={sideChosen}
        setSideChosen={setSideChosen}
      />
      {message && <p className="text-lg text-blue-400 mb-4">{message}</p>}
      <button
        onClick={handleFlip}
        className={`px-6 py-3 bg-green-500 rounded mb-4 hover:bg-green-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Flip Coin'}
      </button>
      <CoinflipResult result={result} />
    </div>
  );
};

export default CoinflipGame;
