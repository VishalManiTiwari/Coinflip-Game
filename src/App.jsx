import React from 'react';
import WalletContextProvider from './WalletProvider';
import CoinflipGame from './components/CoinflipGame';

function App() {
  return (
    <WalletContextProvider>
      <CoinflipGame />
    </WalletContextProvider>
  );
}

export default App;
