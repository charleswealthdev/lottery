// AdminPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const AdminPage = (state) => {
  const [isOwner, setIsOwner] = useState(false);
  const navigate = useNavigate();
  const [winner, setWinner] = useState('');
  console.log(state);

  const handlePickWinner = async () => {
    // const pickedWinner = await pickWinner(); // Call your pickWinner function
    // setWinner(pickedWinner);
    console.log("Working")
  };

  return (
    <div>
      <h1>Admin Page</h1>
     
      Hello
    </div>
  );
};

export default AdminPage;
  