import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { MsalProvider } from '@azure/msal-react';
import { Configuration, PublicClientApplication } from '@azure/msal-browser';

const msalConfig: Configuration = {
  auth: {
    authority:
      "https://login.microsoftonline.com/69fb40d6-e83e-4f50-b89a-cc772b5e0c58",
    clientId: "4d9e40b2-938d-4601-acd8-371960ffad1d",
  },
};
const msalInstance = new PublicClientApplication(msalConfig);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
    <App />
  </StrictMode>,
)
