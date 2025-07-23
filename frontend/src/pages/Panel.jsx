"use client"

import { useState, useEffect } from "react"
import Login from "./login/Login.jsx"
import AdminDashboard from "./dashboard/Dashboard.jsx"

const Panel = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)

  useEffect(() => {
    const storedLoginState = localStorage.getItem("isAdminLoggedIn")
    if (storedLoginState === "true") {
      setIsAdminLoggedIn(true)
    }
  }, [])

  const handleLogin = () => {
    setIsAdminLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn")
    setIsAdminLoggedIn(false)
  }

  if (isAdminLoggedIn) {
    return <AdminDashboard onLogout={handleLogout} />
  } else {
    return <Login onLogin={handleLogin} />
  }
}

export default Panel
