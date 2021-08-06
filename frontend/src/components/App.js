import React, { useState, useEffect } from 'react';
import { Switch, Route, Link, Redirect } from "react-router-dom";
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
      <Sidebar />

      {/* Switch (middle) */}
      <Switch>
        <Route exact path="/">
          <Feed user={user}/> {/* Feed */}
        </Route>
        <Route exact path="/profile">
          <Redirect to={`/profile/${user.username}`} /> {/* Profile */}
        </Route>
        <Route exact path="/profile/:username">
          <Profile /> {/* Profile/username */}
        </Route>
      </Switch>

      {/* Widgets (RHS) */}
      <Widgets/>
    </div>
  );
}

export default App;
