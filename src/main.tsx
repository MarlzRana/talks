import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import TalkPicker from './routes/TalkPicker'
import TalkPlayer from './routes/TalkPlayer'
import './styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/talks" replace />} />
        <Route path="/talks" element={<TalkPicker />} />
        <Route path="/talks/:slug" element={<TalkPlayer />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
