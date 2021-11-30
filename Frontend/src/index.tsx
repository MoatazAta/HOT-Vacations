import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './Components/LayoutArea/Layout/Layout';
import './index.css';
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
