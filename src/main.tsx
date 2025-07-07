import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './App.css'

// 🚀 Реєстрація Spline Service Worker для миттєвого завантаження
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/spline-sw.js')
      .then((registration) => {
        console.log('✅ Spline SW registered:', registration.scope);
      })
      .catch((error) => {
        console.log('❌ Spline SW registration failed:', error);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
