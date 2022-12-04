import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import Navbar from '../components/landingPage/Navbar';
import Vector from '../assets/img/landingPage/cover.jpg';
import Login from '../components/landingPage/Login';
import Footer from '../components/landingPage/Footer';

export default function LandingPage(props) {
  const [error, setError] = useState('');
  const [wallet, setWallet] = useState({
    web3: '',
    account: '',
  });

  const conenctWalletHandler = async () => {
    if (typeof window != 'undefined' && typeof window.ethereum != 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web = new Web3(window.ethereum);
        const accounts = await web.eth.getAccounts();
        setWallet({ web3: web, account: accounts[0] });
      } catch (e) {
        console.log('coonect wallet error: ', e);
        setError(e.message);
      }
    } else {
      console.log('Please install metamask');
      setError('Please install metamask');
    }
  };

  const { account } = wallet;
  useEffect(() => {
    conenctWalletHandler();
  }, []);
  console.log(account);

  return (
    <div className='h-screen max-h-min flex flex-col'>
      <Navbar />

      <div className='body lg:flex px-16 w-full lg:h-5/6 '>
        <img
          src={Vector}
          alt='Graphics'
          className='lg:w-1/2 lg:my-auto lg:mx-auto mt-24'
        />
        <div className='lg:ml-auto lg:w-1/2 w-screen'>
          <Login
            setToastShow={props.setToastShow}
            settoastCondition={props.settoastCondition}
          ></Login>
        </div>
      </div>
      <div className='mt-auto relative bottom-0'>
        <Footer />
      </div>
    </div>
  );
}
