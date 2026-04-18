import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './icons.js';
import { Toaster } from 'react-hot-toast';
import UserContextProvider from './contexts/user-context/UserContextrovider.jsx';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserContextProvider>
    <React.StrictMode>
      <App />
      <Toaster />
    </React.StrictMode>
  </UserContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
