import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Route, Router, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import LayOut from './LayOut.jsx'
import Landing from './pages/Landing.jsx'
import Home from './pages/Home.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import './index.css'
import React from 'react'
import Content from './pages/Content.jsx'
import Render from './pages/Render.jsx'
import Stock from './pages/Stock.jsx'
import Entry from './pages/entry.jsx'
import Dispach from './pages/dispateched.jsx'
import Report from './pages/report.jsx'




const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<LayOut />}>
      <Route path="/" element={<Render />} />
      <Route path="/Home" element={<Content />}>
        <Route path='' element={<Home />} />
        <Route path='Home' element={<Home />} />   
        <Route path='Stock' element={<Stock />} /> 
        <Route path='Entry' element={<Entry />} />  
        <Route path='Dispatched' element={<Dispach />} /> 
        <Route path='Report' element={<Report />} />  
      </Route>
    </Route>
  )
);


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
