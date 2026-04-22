import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ValorPT from './pages/ValorPT';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/ValorPT" replace />} />
        <Route path="/ValorPT" element={<ValorPT />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
