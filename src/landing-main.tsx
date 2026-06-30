import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { UseCase } from './pages/UseCase.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UseCase />
  </StrictMode>,
)
