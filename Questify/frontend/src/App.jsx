import { Navigate, Route, Routes } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/DashboardPage"
import QuestPage from "./pages/QuestPage"

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()

  if (!isLoggedIn) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  const { isLoggedIn } = useAuth()

  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quest/:questId"
        element={
          <ProtectedRoute>
            <QuestPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/"} replace />} />
    </Routes>
  )
}

export default App
