import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initGlobalHaptics } from './utils/haptics';

// Initialize zero-latency iOS tactile feedback
initGlobalHaptics();

createRoot(document.getElementById('root')!).render(<App />);

