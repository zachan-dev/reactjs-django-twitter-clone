import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Feed from './Feed';
import Widgets from './Widgets';
import './App.css';
import APIHelper from '../helpers/api'

function App() {
  const [user, setUser] = useState({});
  
  useEffect(() =>{ // componentWillMount
    APIHelper.getUserInfo().then(user => {
      setUser(user);
    });
  }, []);

  return (
    // BEM
    <div className="app">
      {/* Sidebar (LHS) */}
      <Sidebar />

      {/* Feed (middle) */}
      <Feed user={user}/>

      {/* Widgets (RHS) */}
      <Widgets/>
    </div>
  );
}

export default App;
