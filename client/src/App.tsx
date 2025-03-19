import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import './App.css';

import contractAddresses from './deployed_addresses.json';  
import { AUSD__factory } from './typechain-types';
import { FOOBA__factory } from './typechain-types';
import { AMM__factory } from './typechain-types';

const App: React.FC = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [currency, setCurrency] = useState('AUSD');
  const [amount, setAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferAddress, setTransferAddress] = useState('');
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [userFoobaBalance, setUserFoobaBalance] = useState<string | null>(null);
  const [userAusdBalance, setUserAusdBalance] = useState<string | null>(null);
  const [ammFoobaBalance, setAmmFoobaBalance] = useState<string | null>(null);
  const [ammAusdBalance, setAmmAusdBalance] = useState<string | null>(null);
  useEffect(() => {
    const connectMetaMask = async () => {
      if (!window.ethereum) {
        alert("MetaMask is not installed. Please install MetaMask and try again.");
        return;
      }
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const metaMaskProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(metaMaskProvider);
        const signer = await metaMaskProvider.getSigner();
        const accountAddress = await signer.getAddress();
        setAccount(accountAddress);
        const balanceInWei = await metaMaskProvider.getBalance(accountAddress);
        setBalance(ethers.formatEther(balanceInWei));
        await refreshBalances();
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    };
    connectMetaMask();
  }, []);

  const refreshBalances = async () => {
    if (!provider || !account) return;
    try {
      const signer = await provider.getSigner(account);
      const foobaConn = FOOBA__factory.connect(contractAddresses['AMM#FOOBA'], signer);
      const ausdConn = AUSD__factory.connect(contractAddresses['AMM#AUSD'], signer);
      setUserFoobaBalance(ethers.formatUnits(await foobaConn.balanceOf(account), 18));
      setUserAusdBalance(ethers.formatUnits(await ausdConn.balanceOf(account), 18));
      const ammConn = AMM__factory.connect(contractAddresses['AMM#AMM'], signer);
      const balances = await ammConn.getBalance();
      setAmmFoobaBalance(ethers.formatUnits(balances[1], 18));
      setAmmAusdBalance(ethers.formatUnits(balances[0], 18));
    } catch (error) {
      console.error("Error refreshing balances:", error);
    }
  };

  const transferToken = async (isFooba: boolean) => {
    if (!provider || !account || !transferAmount || !transferAddress) return;
    try {
      const signer = await provider.getSigner(account);
      const tokenContract = isFooba
        ? FOOBA__factory.connect(contractAddresses['AMM#FOOBA'], signer)
        : AUSD__factory.connect(contractAddresses['AMM#AUSD'], signer);
      const tx = await tokenContract.transfer(transferAddress, ethers.parseUnits(transferAmount, 18));
      await tx.wait();
      await refreshBalances();
    } catch (error) {
      console.error("Error transferring token:", error);
    }
  };

  const swapToken = async () => {
    if (!provider || !account || !amount) return;
    try {
      const signer = await provider.getSigner(account);
      const ammContract = AMM__factory.connect(contractAddresses['AMM#AMM'], signer);
      const tokenContract = currency === 'FOOBA' ? contractAddresses['AMM#FOOBA'] : contractAddresses['AMM#AUSD'];
      const tx = await ammContract.swap(tokenContract, ethers.parseUnits(amount, 18));
      await tx.wait();
      await refreshBalances();
    } catch (error) {
      console.error("Error swapping token:", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Currency Converter</h1>
        <div>
          <h3>AMM Balances</h3>
          <p>FOOBA: {Number(ammFoobaBalance).toFixed(3) || '0.000'}</p>
          <p>AUSD: {Number(ammAusdBalance).toFixed(3) || '0.000'}</p>
        </div>
        <div>
          <h3>User Balances</h3>
          <p>Account: {account}</p>
          <p>ETH Balance: {Number(balance).toFixed(3) || '0.000'} ETH</p>
        </div>
        <div>
          <p>FOOBA: {Number(userFoobaBalance).toFixed(3) || '0.000'}</p>
          <p>AUSD: {Number(userAusdBalance).toFixed(3) || '0.000'}</p>
        </div>
        <button onClick={refreshBalances}>Refresh Balances</button>
        <div>
          <h2>Swap</h2>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="AUSD">AUSD</option>
            <option value="FOOBA">FOOBA</option>
          </select>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <button onClick={swapToken}>Swap</button>
        </div>
        <div>
          <h2>Transfer</h2>
          <label>Token: </label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="AUSD">AUSD</option>
            <option value="FOOBA">FOOBA</option>
          </select>
          <div>
            <label> Recipient Address: </label>
            <input type="text" value={transferAddress} onChange={(e) => setTransferAddress(e.target.value)} placeholder="Recipient Address" />
            <label>  Amount: </label>
            <input type="number" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} />
            <button onClick={() => transferToken(currency === 'FOOBA')}>Transfer</button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default App;
