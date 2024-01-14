import { Route, useNavigate ,useLocation} from 'react-router-dom';
import {useEffect} from "react";

const GuardedRoute = ({  }) => {

    const navigate =useNavigate();
    const location = useLocation();
    const owner = location.state.owner;
    const address = location.state.address
    const pickWinner = location.state.pickWinner
    // const contract =location.state
    console.log(owner,address,pickWinner)
useEffect(()=>{
   if(owner===address){
    navigate("./admin")
   }

   else{
    navigate("./home")
   }
},[])
// if(isOwner){
//     navigate("/home")
// }

// else {
//     navigate("./home")
// }

console.log("cool")

}
//     if (!isOwner) {
//         return <Navigate to="/home" replace />;
//       }
//       else {
// return <Navigate to="/admin"/>
//       }
//     }

export default GuardedRoute;