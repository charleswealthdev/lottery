import './App.css';
import Web3 from 'web3';
import { useState, useEffect } from 'react';
import Lottery from './contracts/Lottery.json';

function App() {
  const defaultDuration = 60;
  const [state, setState] = useState({ web3: null, contract: null });
  const [web3, setWeb3] = useState();
  const [address, setAddress] = useState();
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState();
  const [winner, setWinnerAddress] = useState('');
  const [prize, setWinnerPrize] = useState('');
  const [countdown, setCountdown] = useState(() => {
     localStorage.getItem('countdown');
    return defaultDuration;
  });
  const [pastWinners, setPastWinners] = useState([]);
  const [countdowncomplete,setCountdownCompleteStatus] = useState(false)

  const connectWalletHandler = async () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];

        localStorage.setItem('walletAddress', address);

        setWeb3(web3);
        setAddress(address);
        setState({ web3: web3, contract: state.contract, address: address });
      } catch (err) {
        console.log(err.message);
      }
    } else {
      setAddress('');
      console.log('Please install MetaMask');
    }
  };

  const disconnectWalletHandler = () => {
    localStorage.removeItem('walletAddress');

    setWeb3(null);
    setAddress('');
    setState({ web3: null, contract: state.contract, address: '' });
  };

  useEffect(() => {
    const storedAddress = localStorage.getItem('walletAddress');
    if (storedAddress) {
      setAddress(storedAddress);
    }
  }, []);

  useEffect(() => {
    // const provider = new Web3.providers.HttpProvider("https://rpc-mumbai.maticvigil.com/");
    const provider = new Web3(window.ethereum)
    async function connectToContract() {
      try {
        const web3 = new Web3(provider);
        const networkId = await web3.eth.net.getId();
        console.log(networkId);
        const deployedNetwork = Lottery.networks;
        const deployedId = deployedNetwork[networkId];
        console.log(deployedNetwork,deployedId)
  console.log(deployedId.address, " 0x64D6cC4305f1B3a361228bEf9667F6f9919547ef")
        if (deployedId) {
          const contract = new web3.eth.Contract(Lottery.abi, deployedId.address);
          console.log(contract)
          setState({ web3, contract });
        } else {
          console.error("Contract not deployed on the specified network.");
        }
      } catch (error) {
        console.error("Error connecting to the contract:", error);
      }
    }
  
    // Ensure provider is available before attempting to connect
    if (provider) {
      connectToContract();
    } else {
      console.error("Web3 provider not available.");
    }
  }, [/* dependencies if any */]);
  
  

//   useEffect(() => {
//     const handleCountdownTick =  () => {
//       setCountdown((prevCountdown) => {
//         // Decrease the countdown by 1 second
//         const newCountdown = prevCountdown - 1;
//         // console.log(countdowncomplete);
//   // Inside the handleCountdownTick function
// const countStatus = async () => {
//   if (newCountdown === 0) {
//     // If the countdown reaches zero, set the complete status
//     setCountdownCompleteStatus(true);
//     console.log(countdowncomplete);

//     const statustx = await state.contract.methods.checkCountdown(countdowncomplete).send({ from: address, gas: 400000 });
//     console.log(statustx);
//     const event = statustx.events.Status;
//     const eventstatus = event.returnValues.status;
//     console.log(eventstatus);
//     if (eventstatus) {
//       pickWinner();
//       // console.log("working")
//       setCountdown(defaultDuration);
//       console.log(countdowncomplete);
//     }

//     localStorage.setItem('countdown', defaultDuration.toString());
//   } else {
//     localStorage.setItem('countdown', newCountdown.toString());
//   }
// };

// countStatus();

//         return newCountdown;
//     });
//   };
  
//     const intervalId = setInterval(handleCountdownTick, 1000);
  
//     // Cleanup the interval when the component unmounts
//     return () => clearInterval(intervalId);
//   }, [state.contract, countdowncomplete, setCountdown, setCountdownCompleteStatus]);
  
  

// const checkTime =()=> {
//  const Now = new Date();
//  const Now2 = new Date( "Fri Dec 22 2023 21:05:17 GMT+0100");
// const Day = Now.getDay();
// const Hours = Now.getHours();
// const Min = Now.getMinutes();
// const Seconds = Now.getSeconds();
// const Time = Now.getTime();
//  console.log(Now,Day,Hours,Min,Seconds,Now2);

//  if (Now === Now2){
// console.log("working")
//  }
// }

// checkTime()

// function pick(){
// pickWinner();
// }

// const currentTime = new Date();
// const oneMinuteLater = new Date(currentTime.getTime() + 2 * 60 *1000);
// const time = new Date();
// // console.log(time)
// const timeDiff = oneMinuteLater - currentTime;
// setTimeout(pick, timeDiff)

  

  
  useEffect(() => {
    if (state.contract) {
      getBalance();
      getPlayers();
      viewPastWinners();

    }
  }, [state.contract, balance]);

  const getPlayers = async () => {
    const players = await state.contract.methods.viewPlayers().call();
    setPlayers(players);
  };

  const getBalance = async () => {
    const { contract, web3 } = state;
    const balance = await contract.methods.getBalance().call();
    setBalance(web3.utils.fromWei(balance, 'ether'));
  };

  const viewPastWinners = async () => {
    const pastWinners = await state.contract.methods.viewPastWinners().call();
    setPastWinners(pastWinners);
  };

  async function joinGame() {
    const { contract, web3 } = state;
  
    try {
      // Ensure the wallet is connected and unlock the account
    
    
  
      if (contract) {
        // Send the transaction to join the game
        const transaction = await contract.methods.joinGame().send({
          from: address,
          value: web3.utils.toWei("0.05", "ether"),
          gas: 200000, // Adjust gas limit
        });
  
       
        console.log(transaction);
  
        
        getPlayers();
        getBalance();
      } else {
        console.error('Contract not initialized. Make sure it is deployed and available.');
      }
    } catch (err) {
      console.error('Error joining game:', err.message);
    }
  }
  const pickWinner = async () => {
    try {
  
      if(state.contract){
      console.log('Attempting to pick winner...');
      // const countdownFromContract1 = await state.contract.methods.getCountdown().call();
      // setCountdown(parseInt(countdownFromContract1, 10));
      // console.log(countdown,countdownFromContract1)
      const pickWinnerTx = await state.contract.methods.pickWinner().send({
        from: address,
        gas: 5000000,
      });
  
      console.log('Pick Winner Transaction:', pickWinnerTx);
  
      // Check for the WinnerPicked event in the transaction receipt
      const winnerEvent = pickWinnerTx.events.WinnerPicked;
      console.log(winnerEvent);
      if (winnerEvent) {
        setWinnerAddress(winnerEvent.returnValues.winner);
        setWinnerPrize(Web3.utils.fromWei(winnerEvent.returnValues.prize, 'ether'));
      }

      // const countdownFromContract = await state.contract.methods.getCountdown().call();
      // setCountdown(parseInt(countdownFromContract, 10));
      // console.log(countdown,countdownFromContract)
    } } catch (error) {
      console.error('Error picking winner:', error);
    }

    getBalance();

  };
  
  const Pickwinner = async () => {
    try {
      // Call pickWinner function on the smart contract
      const result = await state.contract.methods.pickWinner().send({ from: address });
      console.log('Winner picked:', result);

      // Retrieve winner and prize information
      const winnerResult = await state.contract.methods.winner().call();
      setWinnerAddress(winnerResult);

      const prizeResult = await state.contract.methods.prize().call();
      setWinnerPrize(prizeResult);
    } catch (error) {
      console.error('Error picking winner:', error);
    }
  };

  const claimPrize = async () => {
    try {
      // Call transferPrize function on the smart contract
      const result = await state.contract.methods.transferPrize().send({ from: address });
      console.log('Prize claimed:', result);

      // Reset winner and prize information
      setWinnerAddress(null);
      setWinnerPrize(0);
    } catch (error) {
      console.error('Error claiming prize:', error);
    }
  };

  


  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };


  return (
    <div className="App min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500">
  <div className="bg-white p-8 rounded shadow-md max-w-md w-full">
    <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">🎮 Lottery Game 🎉</h1>
    <button
      onClick={address ? disconnectWalletHandler : connectWalletHandler}
      className="bg-yellow-500 text-white px-6 py-3 rounded-full hover:bg-yellow-600 mb-6 focus:outline-none transition-all"
    >
      {address ? 'Disconnect Wallet' : 'Connect Wallet'}
    </button>
    {address && (
      <p className="mt-2 text-center text-gray-600">
        Connected to: {address.length > 10 ? `${address.slice(0, 10)}...` : address}
      </p>
    )}
    {!address && <p className="mt-2 text-center text-gray-600">Not connected</p>}
    <button
      onClick={joinGame}
      disabled={!address}
      className="mt-6 bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 focus:outline-none transition-all"
    >
      🚀 Enter Lottery
    </button>
      <br />
      <div>
        <h1>Players {players.length}</h1>
        {players.map((player, index) => (
          <p key={index}>{player}</p>
        ))}
      </div>
      <p>Countdown: {formatTime(countdown)} </p> 
      {/* {countdown} */}
      <div>
        <div>
          <p>{prize ? `${prize} Matic was paid to ${winner}` : 'Loading winner'}</p>
        </div>
      </div>
      <p>Pool: {balance}</p>
      <div>
        <h1>Winners {pastWinners.length}</h1>
        {pastWinners.map((pastWinner, index) => (
          <p key={index}>{pastWinner}</p>
        ))}
      </div>
      
      <button onClick={Pickwinner}>winner</button><br/>
      <button onClick={claimPrize}>Claim</button>
    </div>
    </div>
  );
}

export default App;
