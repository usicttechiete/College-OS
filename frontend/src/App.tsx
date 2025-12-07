import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import AuthLayout from './layouts/AuthLayout'
import AccountPage from './pages/AccountPage'
import FoundFormPage from './pages/FoundFormPage'
import FoundPage from './pages/FoundPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import LostFormPage from './pages/LostFormPage'
import MessagesPage from './pages/MessagesPage'
import NotFoundPage from './pages/NotFoundPage'
import SignupPage from './pages/SignupPage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<HomePage />} />
        <Route path="found" element={<FoundPage />} />
        <Route path="found/new" element={<FoundFormPage />} />
        <Route path="lost/new" element={<LostFormPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="account" element={<AccountPage />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
