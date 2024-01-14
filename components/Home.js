import Web3 from 'web3';
import { useState, useEffect,useRef } from 'react';
import Lottery from '../contracts/Lottery.json';

import polygonlogo from "../images/polygon-logo.png";
import { Link,useNavigate} from 'react-router-dom';
import Navigation from './Navigation';
import AdminPage from './Adminpage';
import { isAddress } from 'web3-validator';

function Home() {

    const [state, setState] = useState({ web3: null, contract: null });
    const [web3, setWeb3] = useState();
    const [address, setAddress] = useState();
    const [players, setPlayers] = useState([]);
    const [balance, setBalance] = useState();
    const [winner, setWinnerAddress] = useState('');
    const [prize, setWinnerPrize] = useState('');
    const [isOwner,setIsOwner] = useState(false);
    const [owner,setOwner] = useState("0x346507Ba876a2Ac1b5174D5e296193f201a343AC")
    // const [countdown, setCountdown] = useState(() => {
    //    localStorage.getItem('countdown');
    //   return defaultDuration;
    // });
    const [pastWinners, setPastWinners] = useState([]);
    const sliderRef = useRef(null);
    const [tx,setTX]= useState(0);
    const [totalVolume,setTV] = useState(0);
    const [userStats, setUserStats] = useState({
      wins: 0,
      losses: 0,
      timePlayed: 0,
    });
    // useEffect(() => {
    //   const storedAddress = localStorage.getItem('walletAddress');
    //   if (storedAddress) setAddress(storedAddress);
    // }, []);

    useEffect(()=> {
const storedWinner = localStorage.getItem('winner')
if (storedWinner) setWinnerAddress(storedWinner);
    })
  
    const navigate = useNavigate();
    // useEffect(() => {
    //   const provider = new Web3(window.ethereum);
  
    //   async function connectToContract() {
    //     try {
    //       const web3 = new Web3(provider);
    //       const networkId = await web3.eth.net.getId();
    //       const deployedNetwork = Lottery.networks;
    //       const deployedId = deployedNetwork[networkId];
  
    //       if (deployedId) {
    //         const contract = new web3.eth.Contract(Lottery.abi, deployedId.address);
    //         setState({ web3, contract });
    //       } else {
    //         console.error("Contract not deployed on the specified network.");
    //       }
    //     } catch (error) {
    //       console.error("Error connecting to the contract:", error);
    //     }
    //   }
  
    //   if (provider) connectToContract();
    //   else console.error("Web3 provider not available.");
    // }, []);
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
    // console.log(deployedId.address, " 0x64D6cC4305f1B3a361228bEf9667F6f9919547ef")
          if (deployedId) {
            const contract = new web3.eth.Contract(Lottery.abi, deployedId.address);
            // console.log(contract)
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
    }, []);
    
  
  
    // const connectWallet = async () => {
    //   if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    //     try {
    //               await window.ethereum.request({ method: 'eth_requestAccounts' });
    //       const web3 = new Web3(window.ethereum);
    //       const accounts = await web3.eth.getAccounts();
    //       const address = accounts[0];
  
    //       localStorage.setItem('walletAddress', address);
  
    //       setWeb3(web3);
    //       setAddress(address);
    //       setState({ web3: web3, contract: state.contract, address: address });
    //     } catch (err) {
    //       console.log(err.message);
    //     }
    //   } else {
    //     setAddress('');
    //     console.log('Please install MetaMask');
    //   }

    //   if (address == "0x346507Ba876a2Ac1b5174D5e296193f201a343AC") {
    //     setIsOwner(true);
    //   }
    //   console.log(isOwner)
    // };
  
    // const disconnectWallet = () => {
    //   localStorage.removeItem('walletAddress');
  
    //   setWeb3(null);
    //   setAddress('');
    //   setState({ web3: null, contract: state.contract, address: '' });
    // };  
  
    // useEffect(() => {
    //   const storedAddress = localStorage.getItem('walletAddress');
    //   if (storedAddress) {
    //     setAddress(storedAddress);
    //   }
    // }, []);
    const connectWallet = async () => {
      if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3Instance = new Web3(window.ethereum);
          const accounts = await web3Instance.eth.getAccounts();
          const userAddress = accounts[0];
  
          localStorage.setItem('walletAddress', userAddress);
  
          setWeb3(web3Instance);
          setAddress(userAddress);
          setState({ web3: web3Instance, contract: state.contract, address: userAddress });
  
          if (userAddress === '0x346507Ba876a2Ac1b5174D5e296193f201a343AC') {
            setIsOwner(true);
          }
        } catch (err) {
          console.error(err.message);
        }
      } else {
        setAddress('');
        console.log('Please install MetaMask');
      }
    };
  
    const disconnectWallet = () => {
      localStorage.removeItem('walletAddress');
  
      setWeb3(null);
      setAddress('');
      setIsOwner(false);
      setState({ web3: null, contract: state.contract, address: '' });
    };
  
    useEffect(() => {
      const storedAddress = localStorage.getItem('walletAddress');
    
      if (typeof window.ethereum !== 'undefined' && storedAddress && isAddress(storedAddress)) {
        setAddress(storedAddress);
    
    
        const handleAccountsChanged = (accounts) => {
          if (accounts.length > 0) {
            const userAddress = accounts[0];
            setAddress(userAddress);
    
            if (userAddress === '0x346507Ba876a2Ac1b5174D5e296193f201a343AC') {
              setIsOwner(true);
            } else {
              setIsOwner(false);
            }
          } else {
            setAddress('');
            setIsOwner(false);
          }
        };

        const handleConnectWallet  = ()=>{
          connectWallet()
        }
    
        const handleDisconnect = () => {
    localStorage.removeItem("walletAddress")
          setAddress('');
          setIsOwner(false);
          setState({ web3: null, contract: state.contract, address: '' });
        };
    
        // Listen for account changes
        window.ethereum.on('accountsChanged', handleAccountsChanged);
    
        // Listen for disconnect
        window.ethereum.on('disconnect', handleDisconnect);
        window.ethereum.on('connect', handleConnectWallet);
    
        return () => {
          // Remove event listeners on component unmount
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('disconnect', handleDisconnect);
          window.ethereum.removeListener('connect', handleConnectWallet);
        };
      } else {
        // Handle the case where the stored address is not valid (optional)
        console.warn('Invalid or missing wallet address in localStorage.');
      }
    }, [Web3.utils]); // Include web3.utils as a dependency if it's not recognized by ESLint
    
   
   useEffect(()=>{
  
    const fetchData =async () =>{
    if(state.contract){
    
     await getPlayers()
    await getBalance()
     await viewPastWinners()
      }
  
    }
    fetchData();   
   },[state.contract,balance,players,pastWinners])
  
    // const getTVolume = useCallback(async () => {
    //   try {
    //     const ToVolume = await state.contract.methods.TVolume().call();
    //     setTV(Web3.utils.fromWei(parseInt(ToVolume, 10), 'ether'));
    //   } catch (error) {
    //     console.error('Error fetching total volume:', error);
    //   }
    // }, [state.contract,totalVolume]);
  
    // const getTX = useCallback(async () => {
    //   try {
    //     const TX = await state.contract.methods.TX().call();
    //     setTX(parseInt(TX, 10));
    //   } catch (error) {
    //     console.error('Error fetching total transactions:', error);
    //   }
    // }, [state.contract,tx]);
  
    const getPlayers = async () => {
      try {
        const players = await state.contract.methods.viewPlayers().call();
        setPlayers(players);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    }
  
    const getBalance = async () => {
    const { contract, web3 } = state;
    const balances = await contract.methods.getBalance().call();
    setBalance(Web3.utils.fromWei(balances, 'ether'));
  }
  
  
  
    const viewPastWinners = async () => {
      try {
        const pastWinners = await state.contract.methods.viewPastWinners().call();
        setPastWinners(pastWinners);
      } catch (error) {
        console.error('Error fetching past winners:', error);
      }
    }
  
    
    useEffect(()=>{
  
    const fetchGameStats = async ()=>{
  if(state.contract){
 await userstats()
 await  getTVolume()
 await getTX()
  }

  else {
    return "you are not connected";
  }
    }
    fetchGameStats()
  },[])
  
    const userstats = async ()=>{
      const stats = await state.contract.methods.getPlayerStats(address).call();
      setUserStats({
        wins: parseInt(stats[0], 10),
        losses: parseInt(stats[1], 10),
        timePlayed: parseInt(stats[2], 10),
      });
    }
    
    const getTVolume = async () => {
        const ToVolume = await state.contract.methods.TVolume().call();
        setTV(Web3.utils.fromWei(parseInt(ToVolume, 10), 'ether'));    
    }
  
    const getTX = async () => {
        const TX = await state.contract.methods.TX().call();
        setTX(parseInt(TX, 10));
    }
  
    const joinGame = async () => {
      const { contract, web3 } = state;
      try {
        if (contract) {
          await contract.methods.joinGame().send({
            from: address,
            value: web3.utils.toWei("0.05", "ether"),
            gas: 200000, // Adjust gas limit
          });
  
         
        } else {
          console.error('Contract not initialized. Make sure it is deployed and available.');
        }
      } catch (err) {
        console.error('Error joining game:', err.message);
      }
  
      getBalance();
      getPlayers();
      getTVolume();
      getTX();
      userstats()
      // fetchData();
      // fetchGameStats();
    };
  
    const pickWinner = async () => {
      try {
        if (state.contract) {
          const pickWinnerTx = await state.contract.methods.pickWinner().send({
            from: address,
            gas: 5000000,
          });
  
          console.log('Pick Winner Transaction:', pickWinnerTx);
  
          const winnerEvent = pickWinnerTx.events.WinnerPicked;
          if (winnerEvent) {
            setWinnerAddress(winnerEvent.returnValues.winner);
            setWinnerPrize(Web3.utils.fromWei(winnerEvent.returnValues.prize, 'ether'));
            localStorage.setItem("winner",winnerEvent.returnValues.winner);
          }
        }
      } catch (error) {
        console.error('Error picking winner:', error);
      }
      getBalance();
      getPlayers();
      getTVolume();
      getTX();
      userstats()
      // fetchData();
      // fetchGameStats()
    };
  
    const claimPrize = async () => {
      try {
        await state.contract.methods.transferPrize().send({ from: address });
        setWinnerAddress(null);
        setWinnerPrize(0);
        localStorage.removeItem("winner")
      } catch (error) {
        console.error('Error claiming prize:', error);
      }
  
      getBalance();
      getPlayers();
      getTVolume();
      getTX();
      userstats()
  
      window.location.reload();
    };
  
    const slideLeft = () => {
      if (sliderRef.current) {
        sliderRef.current.scrollLeft -= 200;
      }
    };
  
    const slideRight = () => {
      if (sliderRef.current) {
        sliderRef.current.scrollLeft += 200;
      }
    };
  

return(
  
<div className="App min-h-screen bg-white">

      <div className="bg-white  rounded shadow-md ">

    <Navigation />
       
        

{/* <ToggleCards/> */}
  
 <div> <button
    onClick={address ? disconnectWallet : connectWallet}
    className="bg-yellow-400 text-white px-1 py-2 rounded-full hover:bg-yellow-600 focus:outline-none transition-all"
  >
    {address ? 'Disconnect Wallet' : 'Connect Wallet'}
  </button>
  {address && (
    <p className="ml-1 text-gray-600">
      Connected to: {address.length > 10 ? `${address.slice(0, 10)}...` : address}
    </p>
  )}
  {!address && <p className="ml-1 text-gray-600">Not connected</p>}</div>
        <div className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex flex-col items-center">
        <img src={polygonlogo} alt="Logo" className="w-12 h-12 mb-4" />
        </div>
          <div className="bg-gray-200 text-gray-700 px-6 py-4">
            <h2 className="text-center font-semibold">TOTAL POOL</h2>
          </div>
          <div className="px-6 py-4">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-4xl font-bold text-blue-500">💰</span>
              <p className="text-3xl font-bold text-gray-800">{balance} MATIC</p>
            </div>
          </div>
        </div>

        <br />
      
        <button
          onClick={joinGame}
          disabled={!address}
          className="mt-6 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 focus:outline-none transition-all text-sm sm:text-base mx-auto block"
        >
          Join Pool
        </button>
      <div className="max-w-md mx-auto p-3 bg-white shadow-lg rounded-md">
      <h1 className="text-2xl font-bold text-center mb-4">🎮  {players.length} Players are in the pool</h1>
      <div className="space-y-2">
        {players.map((player, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
            <p className="text-sm sm:text-base">{player}</p>
          
          </div>
        ))}
      </div>
    </div>

      {/* <p>Countdown: {formatTime(countdown)} </p>  */}
      {/* {countdown} */}
      <div>
        <div>
        <div>
              {prize !== null ? (
                <p className='text-center'>
                  {prize ? `${prize} Matic was paid to ${winner}` : 'No winner yet'}
                </p>
              ) : (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-green-500 border-opacity-50"></div>
                  <span className="ml-2">Loading winner...</span>
                </div>
              )}
            </div>
        </div>
      </div>
    
      <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md relative overflow-hidden">
          <h1 className="text-2xl font-bold text-center mb-4">🏆 Winners ({pastWinners.length})</h1>
          <div ref={sliderRef} className="flex space-x-4 overflow-x-auto scrollbar-hide">
            {pastWinners.map((pastWinner, index) => (
              <div key={index} className="flex-none w-48 p-4 bg-gray-100 rounded-md shadow-md">
                <p className="text-sm font-semibold text-gray-800">{pastWinner}</p>
              </div>
            ))}
          </div>
          <button
            onClick={slideLeft}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-500 text-white p-2 rounded-full focus:outline-none"
          >
            &lt;
          </button>
          <button
            onClick={slideRight}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-500 text-white p-2 rounded-full focus:outline-none"
          >
            &gt;
          </button>
        </div>

        {/* <button onClick={pickWinner}>winner</button> */}
        <br />
        {winner ? (
          <button
            onClick={claimPrize}
            disabled={!winner}
            className={!address == winner ? "bg-red-200 px-6 py-3 rounded-full" : "mt-6 bg-blue-500 text-white px-6 py-3 rounded-full focus:outline-none transition-all"}
          >
            {address == winner ? "Claim Bounty" : "not qualified"}
          </button>
        ) : (
          ""
        )}


       

     
<div className="bg-gray-100 text-gray-800 p-8 rounded-md shadow-lg">
  <h1 className="text-3xl font-bold mb-4 text-center">STATS BOARD</h1>
  <div className="grid grid-cols-2 gap-4">
    <div className="bg-blue-500 p-6 rounded-md shadow-md hover:bg-blue-600 transition-all">
      <p className="text-xl font-semibold mb-2">Wins</p>
      <p className="text-2xl">{userStats.wins}</p>
    </div>
    <div className="bg-red-500 p-6 rounded-md shadow-md hover:bg-red-600 transition-all">
      <p className="text-xl font-semibold mb-2">Losses</p>
      <p className="text-2xl">{userStats.losses}</p>
    </div>
    <div className="bg-green-500 p-6 rounded-md shadow-md hover:bg-green-600 transition-all">
      <p className="text-xl font-semibold mb-2">Time Played</p>
      <p className="text-2xl">{userStats.timePlayed}</p>
    </div>
    <div className="bg-yellow-500 p-6 rounded-md shadow-md hover:bg-yellow-600 transition-all">
      <p className="text-xl font-semibold mb-2">Total Volume</p>
      <p className="text-2xl">{totalVolume} Matic</p>
    </div>
    <div className="bg-purple-500 p-6 rounded-md shadow-md hover:bg-purple-600 transition-all">
      <p className="text-xl font-semibold mb-2">Total Block TX</p>
      <p className="text-2xl">{tx}</p>
    </div>
  </div>
</div>


     {/* <div>{nooftimesplayed}</div> */}
     { owner===address? <button onClick={pickWinner}> Pick</button> : ""}
     <div className="flex items-center justify-center bg-gray-100">
          <div className="bg-yellow-200 border-2 border-brown-700 p-8 rounded-lg max-w-md w-full overflow-hidden relative">
            <h1 className="text-2xl font-bold text-brown-700 mb-4 text-center">Participation Manual</h1>
            <div className="text-brown-800 text-justify">
              <p className="mb-4">Deposit some Matic into your metamask, Connect your wallet, make sure you are on the polygon blockchain</p>
              <p className="mb-4">Join the pool by adding Liquidity to the pool (0.05 Matic)</p>
              <p className="mb-4">After a winner is picked by the system, the winner claims LP</p>
            </div>
            <div className="absolute top-0 left-1/2 w-px h-full bg-brown-700 transform -translate-x-1/2"></div>
          </div>
        </div>
      </div>
    </div>
   
)


}

export default Home;
