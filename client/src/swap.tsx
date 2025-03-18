import React, { useState } from 'react';
import { ethers } from 'ethers';
import FOOBA from './contractABIs/FOOBA.json';
import AUSD from './contractABIs/AUSD.json';
import contractAddresses from './deployed_addresses.json';

const Swap: React.FC<{ provider: ethers.BrowserProvider | null; account: string | null }> = ({ provider, account }) => {
  const [sourceToken, setSourceToken] = useState('AUSD');
  const [destinationToken, setDestinationToken] = useState('FOOBA');
  const [amount, setAmount] = useState('');
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);

  const handleSwap = async () => {
    if (!provider || !account) {
      alert('Please connect your wallet first.');
      return;
    }

    try {
      const signer = await provider.getSigner(account);
      const sourceContract = new ethers.Contract(
        sourceToken === 'AUSD'? contractAddresses['AMM#AUSD']: contractAddresses['AMM#FOOBA'],
        sourceToken === 'AUSD' ? AUSD.abi : FOOBA.abi,
        signer
      );
      
      const destinationContract = new ethers.Contract(
        destinationToken === 'AUSD'? contractAddresses['AMM#AUSD']: contractAddresses['AMM#FOOBA'],
        destinationToken === 'FOOBA' ? FOOBA.abi : AUSD.abi,
        signer
      );

      // Approve the contract to spend tokens
      const amountInWei = ethers.parseUnits(amount, 18);
      const approveTx = await sourceContract.approve(contractAddresses['AMM#AMM'], amountInWei);
      await approveTx.wait();
      
      // Perform the swap (Assuming AMM contract handles swapping logic)
      const swapTx = await sourceContract.swap(destinationToken === 'AUSD'? contractAddresses['AMM#AUSD']: contractAddresses['AMM#FOOBA'], amountInWei);
      await swapTx.wait();

      setTransactionStatus('Swap successful!');
    } catch (error) {
      console.error('Swap failed:', error);
      setTransactionStatus('Swap failed. Check console for details.');
    }
  };

  return (
    <div>
      <h2>Swap Tokens</h2>
      <label>
        Source Token:
        <select value={sourceToken} onChange={(e) => setSourceToken(e.target.value)}>
          <option value="AUSD">AUSD</option>
          <option value="FOOBA">FOOBA</option>
        </select>
      </label>
      <label>
        Destination Token:
        <select value={destinationToken} onChange={(e) => setDestinationToken(e.target.value)}>
          <option value="FOOBA">FOOBA</option>
          <option value="AUSD">AUSD</option>
        </select>
      </label>
      <label>
        Amount:
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </label>
      <button onClick={handleSwap}>Swap</button>
      {transactionStatus && <p>{transactionStatus}</p>}
    </div>
  );
};

export default Swap;
