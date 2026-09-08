import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import './globals.css';
import AcademicPage from './AcademicPage';

createRoot(document.getElementById('root')!).render(<StrictMode><AcademicPage /></StrictMode>);
