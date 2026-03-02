/**
 * @file main.jsx
 * @description Entry point aplikasi React.
 * Menginisialisasi root React, membungkus App dengan BrowserRouter
 * agar routing berbasis URL berfungsi di seluruh aplikasi.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)