import { useContext } from "react"
import { Navigate } from "react-router"
import { authContext } from "../context/AuthContext"

export default function AuthProtectedRoutes({ children }) {
  const { token } = useContext(authContext)


  if (token) return <Navigate to="/" replace />

  return children
}
