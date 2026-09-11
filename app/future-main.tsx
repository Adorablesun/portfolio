import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import './globals.css';
import FuturePage, { type FuturePageKind } from './FuturePage';

const kind = document.body.dataset.page as FuturePageKind;

createRoot(document.getElementById('root')!).render(
  <StrictMode><FuturePage kind={kind} /></StrictMode>,
);
