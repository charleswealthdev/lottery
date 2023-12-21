import './input.css';
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
    const connectToBscTestnet = async () => {
      try {
        const provider = new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');
        const web3 = new Web3(provider);
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Lottery.networks;
        const deployedId = deployedNetwork[networkId];

        if (deployedId) {
          const contract = new web3.eth.Contract(Lottery.abi, deployedId.address);
          setState({ web3, contract });
        } else {
          console.error('Contract not deployed on the specified network.');
        }
      } catch (error) {
        console.error('Error connecting to BSC testnet:', error);
      }
    };

    connectToBscTestnet();
  }, []);

  
  // useEffect(() => {
  //   const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
  
  //   async function template() {
  //     const web3 = new Web3(provider);
  //     const network_id = await web3.eth.net.getId();
  //     // console.log("Network ID:", network_id);
  //     const deployedNetwork = Lottery.networks;
  //     const deployedid = deployedNetwork[network_id];
  //     if (deployedid) {
  //       const contract = new web3.eth.Contract(Lottery.abi, deployedid.address);
  //       // console.log("Contract Address:", deployedid.address);
  //       setState({ web3: web3, contract: contract });
  //     } else {
  //       console.error("Contract not deployed on the specified network.");
  //     }
  //   }
  //   provider && template();
  // }, []);

  useEffect(() => {
    const handleCountdownTick =  () => {
      setCountdown((prevCountdown) => {
        // Decrease the countdown by 1 second
        const newCountdown = prevCountdown - 1;
        // console.log(countdowncomplete);
  // Inside the handleCountdownTick function
const countStatus = async () => {
  if (newCountdown === 0) {
    // If the countdown reaches zero, set the complete status
    setCountdownCompleteStatus(true);
    console.log(countdowncomplete);

    const statustx = await state.contract.methods.checkCountdown(countdowncomplete).send({ from: address, gas: 400000 });
    console.log(statustx);
    const event = statustx.events.Status;
    const eventstatus = event.returnValues.status;
    console.log(eventstatus);
    if (eventstatus) {
      pickWinner();
      // console.log("working")
      setCountdown(defaultDuration);
      console.log(countdowncomplete);
    }

    localStorage.setItem('countdown', defaultDuration.toString());
  } else {
    localStorage.setItem('countdown', newCountdown.toString());
  }
};

countStatus();

        return newCountdown;
    });
  };
  
    const intervalId = setInterval(handleCountdownTick, 1000);
  
    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [state.contract, countdowncomplete, setCountdown, setCountdownCompleteStatus]);
  
  




  

  
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
      if (contract) {
        const transaction = await contract.methods.joinGame().send({
          from: address,
          value: web3.utils.toWei("0.005", "ether"),
          gas: 3000000,
       
        });
        
        // Log the transaction details to the console
        console.log(transaction);
        getPlayers();
        getBalance();
        // Update the UI or perform additional actions as needed
      } else {
        console.error('Contract not initialized. Make sure it is deployed and available.');
      }
    } catch (err) {
      console.error(err.message);
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
  

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };


  return (
    <div className="App min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-600 to-indigo-800">
  <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
    <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">🎉 Lottery Game 🎲</h1>
    <button
      onClick={address ? disconnectWalletHandler : connectWalletHandler}
      className="bg-yellow-500 text-white px-6 py-3 rounded-full mb-6 w-full hover:bg-yellow-600 focus:outline-none transition-all"
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
      className="bg-green-500 text-white px-6 py-3 rounded-full mb-8 w-full hover:bg-green-600 focus:outline-none transition-all"
    >
      🚀 Enter Lottery
    </button>
    <div className="text-center">
      <p className="text-lg text-gray-700 mb-4">Countdown: {formatTime(countdown)}</p>
      <div className="mb-8">
        <p className="text-lg text-gray-700">
          {prize ? `🏆 ${prize} Ether was paid to ${winner}` : 'Loading winner'}
        </p>
      </div>
      <p className="text-lg text-gray-700 mb-4">Pot Balance: {balance}</p>
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Past Winners: {pastWinners.length}</h1>
      <div className="space-y-2">
        {pastWinners.map((pastWinner, index) => (
          <p key={index} className="text-md text-gray-700">
            🌟 {pastWinner}
          </p>
        ))}
      </div>
    </div>
    <button
      onClick={pickWinner}
      className="mt-8 bg-yellow-500 text-white px-6 py-3 rounded-full w-full hover:bg-yellow-600 focus:outline-none transition-all"
    >
      🏅 Pick Winner
    </button>
  </div>
</div>

  );
}

export default App;
