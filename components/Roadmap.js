import React from 'react';
import { Link} from 'react-router-dom';
import Navigation from './Navigation';

const Roadmap = () => {
  return (
    <div>
              <Navigation/>
    
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      
      <div className="bg-white p-8 rounded-md max-w-3xl w-full shadow">

        <h1 className="text-4xl font-bold mb-6 text-center text-purple-800 relative z-10">
<Link to="/"> Roadmap</Link>         
        </h1>

        <div className="relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-opacity-20 bg-gray-100 filter blur-md"></div>
          <div className="bg-white p-8 rounded-md shadow-md relative z-20">
        <div className="mb-8">
          <div className="flex items-center">
            <div className="flex-none w-8 h-8 bg-red-800 rounded-full"></div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-800">Phase 1</h2>
              <p className="text-gray-600">
              V1 Testnet Rollup
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center">
            <div className="flex-none w-8 h-8 bg-red-400 rounded-full"></div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-800 ">Phase 2</h2>
              <p className="text-gray-600">
                V2 Testnet Rollup
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center">
            <div className="flex-none w-8 h-8 bg-yellow-300 rounded-full"></div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-800">Phase 3</h2>
              <p className="text-gray-600">
              V3 Testnet Rollup
              </p>
            </div>
          </div>
        </div>

        <div>

        <div className="mb-8">
          <div className="flex items-center">
            <div className="flex-none w-8 h-8 bg-green-300 rounded-full"></div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-800">Phase 4</h2>
              <p className="text-gray-600">
              Mainnet
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center">
            <div className="flex-none w-8 h-8 bg-green-500 rounded-full"></div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-800">Phase 5</h2>
              <p className="text-gray-600">
              Presale | Airdrop | PreMarketing
              </p>
            </div>
          </div>
        </div>


          <div className="flex items-center">
            <div className="flex-none w-8 h-8 bg-blue-500 rounded-full"></div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-800">Phase 6</h2>
              <p className="text-gray-600">
                Marketing | Listing
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
    </div>
  );
};

export default Roadmap;
