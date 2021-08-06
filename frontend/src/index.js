import React from 'react';
import ReactDOM from 'react-dom';
import './styles/base/index.css';
import App from './components/App';
import { BrowserRouter as Router } from "react-router-dom";
import reportWebVitals from './helpers/reportWebVitals';

ReactDOM.render(
  <Router>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Router>,
  document.getElementById('app')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
