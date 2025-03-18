import { useSDK } from "@metamask/sdk-react";
import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import { Button, Card, CircularProgress, Typography, Alert } from "@mui/material";

export const WalletCard = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState<string | null>(null);
  const [connButtonText, setConnButtonText] = useState('Connect Wallet');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { sdk, provider, balance } = useSDK();

  useEffect(() => {
    if (window.ethereum) {
      //@ts-ignore
      window.ethereum.on('accountsChanged', accountChangedHandler);
      //@ts-ignore
      window.ethereum.on('chainChanged', chainChangedHandler);
    }
  }, []);

  const connectWalletHandler = async () => {
    setLoading(true);
    try {
      const accounts = await sdk?.connect();
      const account = accounts?.[0];
      if (account) {
        console.log('Connected account:', account[0]);
        setAccount(account);
        setConnButtonText('Wallet Connected');
        if (balance) {
          setUserBalance(ethers.formatEther(balance));
        } else {
          getAccountBalance(account);
        }
      } else {
        throw new Error('No account found');
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const accountChangedHandler = async (newAccount: string) => {
    console.log('Account changed:', newAccount);
    setAccount(newAccount);
    getAccountBalance(newAccount);
  };

  const getAccountBalance = async (account: string) => {
    try {
      console.log('Getting balance for account:', account);
      const balance = await provider?.request({
        method: 'eth_getBalance',
        params: [account, 'latest'],
      });
      if (balance) {
        setUserBalance(ethers.formatEther(balance.toString()));
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const chainChangedHandler = () => {
    window.location.reload();
  };

  // Helper to shorten the address
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card variant="outlined" style={{ padding: '20px', textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
      <Typography variant="h5">Connection to MetaMask</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={connectWalletHandler}
          style={{ marginTop: '20px' }}
        >
          {connButtonText}
        </Button>
      )}

      {account && (
        <>
          <Typography variant="h6" style={{ marginTop: '20px' }}>Address: {shortenAddress(account)}</Typography>
          <Typography variant="h6" style={{ marginTop: '10px' }}>Balance: {userBalance ? `${userBalance} ETH` : 'Loading...'}</Typography>
        </>
      )}

      {errorMessage && (
        <Alert severity="error" style={{ marginTop: '20px' }}>
          {errorMessage}
        </Alert>
      )}
    </Card>
  );
};
