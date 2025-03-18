import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import './App.css';

import FOOBA from './contractABIs/FOOBA.json';
import AUSD from './contractABIs/AUSD.json';
import AMM from './contractABIs/AMM.json';
import contractAddresses from './deployed_addresses.json';  
import { WalletCard } from './walletCard';

const App: React.FC = () => {
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | ethers.BrowserProvider | null>(null);
  const [currency, setCurrency] = useState('AUSD');
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [foobaContractAddress, setFoobaContractAddress] = useState<string | null>(null);
  const [ausdContractAddress, setAusdContractAddress] = useState<string | null>(null);
  const [ammContractAddress, setAmmContractAddress] = useState<string | null>(null);
  const [ammFoobaBalance, setAmmFoobaBalance] = useState<string | null>(null);
  const [ammAusdBalance, setAmmAusdBalance] = useState<string | null>(null);
  const [userFoobaBalance, setUserFoobaBalance] = useState<string | null>(null);
  const [userAusdBalance, setUserAusdBalance] = useState<string | null>(null);
  useEffect(() => {
          
    const connectMetaMask = async () => {
      try {
        if (!window.ethereum) {
          alert("MetaMask is not installed. Please install MetaMask and try again.");
          return;
        }
  
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const metaMaskProvider = new ethers.BrowserProvider(window.ethereum);
        
        // Set the provider state
        setProvider(metaMaskProvider);
        setAmmContractAddress(contractAddresses['AMM#AMM']);
        setAusdContractAddress(contractAddresses['AMM#AUSD']);
        setFoobaContractAddress(contractAddresses['AMM#FOOBA']);
        // Get accounts from MetaMask
        const signer = await metaMaskProvider.getSigner();
        const accountAddress = await signer.getAddress();
        setAccount(accountAddress);
        // Fetch the user's balance in Ether
        const balanceInWei = await metaMaskProvider.getBalance(accountAddress);
        const balanceInEther = ethers.formatEther(balanceInWei);
        setBalance(balanceInEther);
        
        refreshBalances();
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    };
  
    // Listen for account changes and update the account address and balance
    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        alert("Please connect to MetaMask.");
      } else {
        const newAccount = accounts[0];
        setAccount(newAccount);
  
        // Fetch the new account's balance in Ether
        const balanceInWei = await provider?.getBalance(newAccount);
        const balanceInEther = ethers.formatEther(balanceInWei || 0);
        setBalance(balanceInEther);
  
        // Update contract connections for the new account
        const signer = await provider?.getSigner(newAccount);
        if (signer) {
          const foobaConn = new ethers.Contract(contractAddresses['AMM#FOOBA'], FOOBA.abi, signer);
          const ausdConn = new ethers.Contract(contractAddresses['AMM#AUSD'], AUSD.abi, signer);
  
          const userFoobaBalance = await foobaConn.balanceOf(newAccount);
          const userAusdBalance = await ausdConn.balanceOf(newAccount);
  
          setUserAusdBalance(userAusdBalance.toString());
          setUserFoobaBalance(userFoobaBalance.toString());
        }
      }
    };
  
    connectMetaMask(); // Connect to MetaMask on component mount
  
  }, []);
  
  
  const refreshBalances= async () => {
    try {
      if (!provider || !account) {
        throw new Error("Provider or account not available");
      }
      const signer = await provider.getSigner(account);    
      
      const foobaConn = new ethers.Contract(contractAddresses['AMM#FOOBA'], FOOBA.abi, signer);
      const foobaBalance = await foobaConn.balanceOf(account);
      console.log("user Fooba balance:", foobaBalance.toString());
      setUserFoobaBalance(foobaBalance.toString());
      
      const ausdConn = new ethers.Contract(contractAddresses['AMM#AUSD'], AUSD.abi, signer);
      const ausdBalance = await ausdConn.balanceOf(account);
      console.log("user Ausd balance:", ausdBalance.toString());
      setUserAusdBalance(ausdBalance.toString());

      const ammConn = new ethers.Contract(contractAddresses['AMM#AMM'], AMM.abi, signer);
      const ammBalances = await ammConn.getBalance();
      setAmmAusdBalance(ammBalances[0].toString());
      setAmmFoobaBalance(ammBalances[1].toString());

    } catch (error) {
      console.error('Error refreshing balance:', error);
    }
  };
  const handleCurrencyChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value);

    if (provider && account && ausdContractAddress && foobaContractAddress) {
      // Refresh the balances for the newly selected currency
      await refreshBalances();
    }

  };
  // Handle "Go" button click
  const handleGoClick = async () => {
    // Ensure the amount is a valid number
    // If the selected currency is AUSD, call the AUSD contract
    // call AMM contract swap function, pass AUSD contract address and 
    if (!provider || !account) {
      throw new Error("Provider or account not available");
    }
    if (!amount || amount === '0') {
      alert("Please enter an amount.");
      return;
    }
    if (currency === 'FOOBA') {
      try {
        if (!foobaContractAddress ) {
          throw new Error("FOOBA contract address not available");
          
        }
        const foobaContract = new ethers.Contract(foobaContractAddress, FOOBA.abi, await provider.getSigner());
        if (foobaContract) {
          const ammConn = new ethers.Contract(contractAddresses['AMM#AMM'], AMM.abi, await provider.getSigner());
          const resp = await ammConn.swap(foobaContract, (Number(amount)*10**18).toString());
          console.log("Swap response:", resp);  
          
        } else {
          alert("Contract not connected!");
        }
      } catch (error) {
        console.error("Error interacting with contract:", error);
      }
    } else if(currency === 'AUSD') {
      try {
        if (!ausdContractAddress) {
          throw new Error("AUSD contract address not available");
        }
        const ausdContract = new ethers.Contract(ausdContractAddress, AUSD.abi, await provider.getSigner());
        if (ausdContract) {
          const resp = await ausdContract.transfer(contractAddresses['AMM#AMM'], (Number(amount)*10**18).toString());
          console.log("Transfer response:", resp);
        } else {
          alert("Contract not connected!");
        }
      } catch (error) {
        console.error("Error interacting with contract:", error);
      }
    }
    else {
      alert(`Currency: ${currency}, Amount: ${amount}`);
    }
  };

  const handleReefreshBalanceClick = async () => {
    await refreshBalances();
  };

  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <h1>Currency Converter</h1>

  //       {account ? (
  //         <div>
  //           <p>Connected Account: {account}</p>
  //           <p>ETH Balance: {balance ? Number(balance).toFixed(3) : '0.000'} ETH</p>
  //         </div>
  //       ) : (
  //         <p>Connecting to local EVM chain...</p>
  //       )}

  //       <label>
  //         Select Currency:
  //         <select
  //           value={currency}
  //           onChange={handleCurrencyChange}
  //           className="App-select"
  //         >
  //           <option value="AUSD">AUSD</option>
  //           <option value="FOOBA">FOOBA</option>
  //         </select>
  //       </label>
  //       <label>User Balance</label>
  //       <label>
  //         FOOBA Balance: {userFoobaBalance ? Number(userFoobaBalance) / 10 ** 18 : '0'}
  //       </label>
  //       <label>
  //         AUSD Balance: {userAusdBalance ? Number(userAusdBalance) / 10 ** 18 : '0'}
  //       </label>
  //       <label>AMM Balance</label>
  //       <label>
  //         FOOBA Balance: {ammFoobaBalance ? Number(ammFoobaBalance) / 10 ** 18 : '0'}
  //       </label>
  //       <label>
  //         AUSD Balance: {ammAusdBalance ? Number(ammAusdBalance) / 10 ** 18 : '0'}
  //       </label>
  //       <button onClick={handleReefreshBalanceClick} className="App-button">
  //         Refresh Balance
  //       </button>
  //       <label>
  //         Enter Amount:
  //         <input
  //           type="number"
  //           value={amount}
  //           onChange={(e) => setAmount(e.target.value)}
  //           className="App-input"
  //           placeholder="Enter amount"
  //           step="0.01"
  //         />
  //       </label>

  //       <button onClick={handleGoClick} className="App-button">
  //         Go
  //       </button>

  //       {/* {foobaContract && contractAddress && (
  //         <p>FOOBA Contract connected at: {contractAddress}</p>
  //       )} */}
  //     </header>
  //   </div>
  // );
  return (
    <div className="App">
      <header className="App-header">
        <h1>Currency Converter</h1>
        <h2>Account Information</h2>
        {/* Section 1: Balances and Account Information */}
        <section className="App-section">
          {account ? (
            <div>
              <p>Connected Account: {account}</p>
              <p>ETH Balance: {balance ? Number(balance).toFixed(3) : '0.000'} ETH</p>
            </div>
          ) : (
            <p>Connecting to local EVM chain...</p>
          )}
          
          <div className="App-balance">
            <h3>User Balances</h3>
            <p>FOOBA Balance: {userFoobaBalance ? (Number(userFoobaBalance) / 10 ** 18).toFixed(3) : '0.000'}</p>
            <p>AUSD Balance: {userAusdBalance ? (Number(userAusdBalance) / 10 ** 18).toFixed(3) : '0.000'}</p>
          </div>
          <div className="App-balance">
            <h3>AMM Balances</h3>
            <p>FOOBA Balance: {ammFoobaBalance ? (Number(ammFoobaBalance) / 10 ** 18).toFixed(3) : '0.000'}</p>
            <p>AUSD Balance: {ammAusdBalance ? (Number(ammAusdBalance) / 10 ** 18).toFixed(3) : '0.000'}</p>
          </div>
          <button onClick={handleReefreshBalanceClick} className="App-button">
            Refresh Balances
          </button>
        </section>
  
        {/* Section 2: Perform Transfers */}
        <section className="App-section">
          <h2>Perform Transfer</h2>
          <label>
            Select Input Currency:
            <select
              value={currency}
              onChange={handleCurrencyChange}
              className="App-select"
            >
              <option value="AUSD">AUSD</option>
              <option value="FOOBA">FOOBA</option>
            </select>
          </label>
          <label>
            Enter Amount:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="App-input"
              placeholder="Enter amount"
              step="0.01"
            />
          </label>
          <button onClick={handleGoClick} className="App-button">
            Swap
          </button>
        </section>
      </header>
    </div>
  );
};

export default App;
