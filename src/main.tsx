import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import * as serviceWorkerRegistration from "./serviceWorkerRegistration"
// import { ThemeProvider } from './contents/ThemeContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

serviceWorkerRegistration.register({
  onUpdate: (registration: ServiceWorkerRegistration) => {
    console.log('Service worker updated:', registration);
  },
  onSuccess: (registration: ServiceWorkerRegistration) => {
    console.log('Service worker registered successfully:', registration);
  },
})
