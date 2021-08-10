import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from './Sidebar';
import Feed from './Feed';
import Profile from './Profile';
import Widgets from './Widgets';
import '../styles/components/App.css';
import APIHelper from '../helpers/api'

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
        <Route path="/" element={<Feed user={user}/>} /> {/* Feed */}
        <Route path="/profile" element={<Navigate to={`/profile/${user.username}`} />} /> {/* Profile */}
        <Route path="/profile/:username*" element={<Profile user={user}/>} /> {/* Profile/username */}
      </Routes>

      {/* Widgets (RHS) */}
      <Widgets/>
    </div>
  );
}

export default App;
