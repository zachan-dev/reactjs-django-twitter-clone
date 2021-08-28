// React Imports
import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
// Custom Components
import Sidebar from './Sidebar';
import Feed from './Feed';
import Profile from './Profile';
import Widgets from './Widgets';
// Custom Helpers
import APIHelper from '../helpers/api'
// Custom Styling
import '../styles/components/App.css';


function App() {
  const [user, setUser] = useState({});
  
  useEffect(() =>{ // componentWillMount
    APIHelper.getCurrentUserInfo().then(user => {
      setUser(user);
    });
  }, []);

  return (
    // BEM
    <div className="app">
      {/* Sidebar (LHS) */}
      <Sidebar user={user} />

      {/* Routes (middle) */}
      <Routes>
        <Route path="/" element={<Feed user={user}/>} /> 
        <Route path="/:tab" element={<Feed user={user}/>} /> 
        <Route path="/profile/:username/" element={<Profile user={user}/>} /> {/* Profile/username */}
        <Route path="/profile/:username/:tab" element={<Profile user={user}/>} /> 
      </Routes>

      {/* Widgets (RHS) */}
      <Widgets/>
    </div>
  );
}

export default App;
