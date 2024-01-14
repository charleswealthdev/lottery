import { useState } from "react";
import { Link } from "react-router-dom";

const Navigation =  ()=> {
    // const [addresse,setAddress] = useState("");

   
return(

<div>
    <div className="flex items-center justify-between p-4">
  <h1 className="text-4xl font-bold text-purple-800">MA3ICS</h1>
 
</div>

      <div className="hidden md:block">
            <div className="mr-5 flex items-baseline space-x-7">
        <Link to="/"  className="text-purple-500 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font medium">Home</Link>
          <Link to="/roadmap"  className="text-purple-500 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font medium">Roadmap</Link>
          <br/>
          </div>
          </div>
       </div>
)

}

export default Navigation;