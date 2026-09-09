import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import './globals.css';
import './personal.css';
import PersonalPage from './PersonalPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersonalPage />
  </StrictMode>,
);
