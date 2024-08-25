import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram, Connection, clusterApiUrl } from '@solana/web3.js';
import WalletConnectButton from './WalletConnectButton';
import BetForm from './BetForm';
import CoinflipResult from './CoinflipResult';

const TREASURY_PUBLIC_KEY = '2PmyuJ9FxC4Q1jZB8tdLbRc4rfyzYzpm9AzT8i6DsnAA'; 
const treasuryPublicKey = new PublicKey(TREASURY_PUBLIC_KEY);

const connection = new Connection(clusterApiUrl('devnet'));

const CoinflipGame = () => {
  const { publicKey, sendTransaction } = useWallet();
  const [betAmount, setBetAmount] = useState(0.1);
  const [sideChosen, setSideChosen] = useState('heads');
  const [result, setResult] = useState('');

  const flipCoin = () => Math.random() < 0.5 ? 'heads' : 'tails';

  // Handle coin flip and transaction logic
  const handleFlip = async () => {
    if (!publicKey) {
      alert('Please connect your wallet');
      return;
    }

    const flipResult = flipCoin();
    setResult(flipResult);

    if (flipResult === sideChosen) {
      await payoutUser(betAmount);
    } else {
      await sendToTreasury(betAmount);
    }
  };

  // Function to payout user
  const payoutUser = async (amount) => {
    if (!publicKey) return;

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: treasuryPublicKey,
        toPubkey: publicKey,
        lamports: amount * 2 * 1e9, 
      })
    );

    try {
      await sendTransaction(transaction, connection);
      console.log('Payout successful');
    } catch (error) {
      console.error('Payout failed:', error);
    }
  };

  const sendToTreasury = async (amount) => {
    if (!publicKey) return;

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: treasuryPublicKey,
        lamports: amount * 1e9,
      })
    );

    try {
      await sendTransaction(transaction, connection);
      console.log('Sent to treasury');
    } catch (error) {
      console.error('Transaction failed:', error);
    }
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
      <button
        onClick={handleFlip}
        className="px-6 py-3 bg-green-500 rounded mb-4 hover:bg-green-600"
      >
        Flip Coin
      </button>
      <CoinflipResult result={result} />
    </div>
  );
};

export default CoinflipGame;
