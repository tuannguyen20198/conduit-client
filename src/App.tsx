import { createContext } from 'react'
import { Route, Routes } from "react-router-dom";
import NotFoundPage from './pages/404'
import LoginPage from './pages/Login'

export const ThemeContext = createContext(null) as any

function App() {
  return (

    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
