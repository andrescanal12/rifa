import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Home from './Home.jsx'
import App from './App.jsx'
import AppColombia from './AppColombia.jsx'
import VerEspana from './VerEspana.jsx'
import VerColombia from './VerColombia.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/espana" element={<App />} />
        <Route path="/colombia" element={<AppColombia />} />
        <Route path="/ver/espana" element={<VerEspana />} />
        <Route path="/ver/colombia" element={<VerColombia />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

