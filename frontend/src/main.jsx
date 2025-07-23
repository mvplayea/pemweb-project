import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './App.jsx'
import Order from './pages/order/Order.jsx';
import Panel from './pages/Panel.jsx';
import Gallery from './pages/gallery/Gallery.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/order" element={<Order />} />
      <Route path="/panel" element={<Panel />} />
      <Route path="/gallery" element={<Gallery />} />
    </Routes>
  </BrowserRouter>,
)
