import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initInteractions } from '@/lib/interaction'

createRoot(document.getElementById("root")!).render(<App />);

// Initialize global interactions (ripples, reveal-on-scroll)
if (typeof window !== 'undefined') {
	try {
		initInteractions();
	} catch (e) {
		// no-op
	}
}
