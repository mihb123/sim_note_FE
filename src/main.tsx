import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import '@/styles/editor.css';
import RouteApp from '@/routes/index.tsx'

globalThis.log = console.log;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <RouteApp />
    </BrowserRouter>
  </StrictMode>,
)
