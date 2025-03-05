// import NextTopLoader from 'nextjs-toploader'
import { createContext } from 'react'
import { Route, Routes } from "react-router-dom";
// import MainLayout from './layouts/MainLayout'
// import HttpPage401 from './pages/401'
// import HttpPage403 from './pages/403'
import NotFoundPage from './pages/404'
// import Http500Page from './pages/500'
// import ArchivesPage from './pages/Archives'
import BotsPage from './pages/Bots'
import DetailBot from './containers/DetailBot'
import LoginPage from './pages/Login'
// import ProtectedRoutes from './pages/ProtectedRoutes'

export const ThemeContext = createContext(null) as any

function App() {
  return (

    <Routes>
      <Route path="/" element={<BotsPage />} />
      <Route path="/:id" element={<DetailBot />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
