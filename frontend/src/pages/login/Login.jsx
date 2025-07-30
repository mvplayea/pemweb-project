"use client"

import { useState } from "react"
import styled from "styled-components"
import { API_CONFIG, apiCall } from "../../../api-config"

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`

const LoginForm = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
`

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
`

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background: #5a6fd8;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
`

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;
  margin-right: 10px;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`

const ApiStatusIndicator = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.8rem;
  z-index: 1000;
  
  ${(props) => {
    switch (props.status) {
      case "api":
        return "background: #d4edda; color: #155724;"
      case "local":
        return "background: #fff3cd; color: #856404;"
      case "error":
        return "background: #f8d7da; color: #721c24;"
      default:
        return "background: #e2e3e5; color: #383d41;"
    }
  }}
`

// Utility functions for null safety
const safeString = (value) => value || ""

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [authSource, setAuthSource] = useState("unknown")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCredentials((prev) => ({
      ...prev,
      [name]: safeString(value),
    }))
  }

  const authenticateWithAPI = async (credentials) => {
    try {
      const result = await apiCall(API_CONFIG.endpoints.auth.login, {
        method: "POST",
        body: JSON.stringify(credentials),
      })

      if (result && result.success) {
        setAuthSource("api")
        return result
      } else {
        throw new Error(result?.message || "API authentication failed")
      }
    } catch (error) {
      console.warn("API authentication failed:", error.message)
      throw error
    }
  }

  const authenticateLocally = (credentials) => {
    // Simple local authentication
    if (safeString(credentials.username) === "admin" && safeString(credentials.password) === "admin123") {
      setAuthSource("local")
      return {
        success: true,
        message: "Login successful",
        data: {
          token: "local-auth-token-" + Date.now(),
          user: {
            id: "admin-1",
            username: "admin",
            email: "admin@example.com",
            role: "administrator",
            permissions: ["orders:read", "orders:write", "clients:read", "analytics:read"],
          },
        },
      }
    } else {
      throw new Error("Invalid credentials")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setAuthSource("unknown")

    try {
      let result

      if (API_CONFIG.useAPI) {
        try {
          // Try API authentication first
          result = await authenticateWithAPI(credentials)
        } catch (apiError) {
          console.warn("API auth failed, falling back to local:", apiError.message)
          // Fallback to local authentication
          result = authenticateLocally(credentials)
        }
      } else {
        // Use local authentication only
        result = authenticateLocally(credentials)
      }

      if (result && result.success) {
        // Store auth data
        if (result.data?.token) {
          localStorage.setItem("authToken", result.data.token)
        }
        localStorage.setItem("isAdminLoggedIn", "true")
        localStorage.setItem(
          "adminUser",
          JSON.stringify(
            result.data?.user || {
              id: "admin-1",
              username: credentials.username,
              role: "administrator",
            },
          ),
        )

        onLogin()
      } else {
        throw new Error("Authentication failed")
      }
    } catch (error) {
      setError(error.message || "Login failed")
      setAuthSource("error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <LoginContainer>
      {authSource !== "unknown" && (
        <ApiStatusIndicator status={authSource}>
          {authSource === "api"
            ? "API Auth"
            : authSource === "local"
              ? "Local Auth"
              : authSource === "error"
                ? "Auth Error"
                : ""}
        </ApiStatusIndicator>
      )}

      <LoginForm onSubmit={handleSubmit}>
        <Title>Admin Login</Title>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <FormGroup>
          <Label htmlFor="username">Username</Label>
          <Input
            type="text"
            id="username"
            name="username"
            value={safeString(credentials.username)}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={safeString(credentials.password)}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />
        </FormGroup>

        <Button type="submit" disabled={isLoading}>
          {isLoading && <LoadingSpinner />}
          {isLoading ? "Logging in..." : "Login"}
        </Button>

        <div style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.9rem", color: "#666" }}>
          Demo credentials: admin / admin123
          <br />
          <small>
            Auth source:{" "}
            {authSource === "api" ? "API Server" : authSource === "local" ? "Local Storage" : "Auto-detect"}
          </small>
        </div>
      </LoginForm>
    </LoginContainer>
  )
}

export default Login

/*
API ENDPOINT FOR AUTHENTICATION:

POST /api/auth/login
Request:
{
  "username": "admin",
  "password": "admin123"
}

Response Success (200):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "admin-1",
      "username": "admin",
      "email": "admin@example.com",
      "role": "administrator",
      "permissions": ["orders:read", "orders:write", "clients:read", "analytics:read"]
    }
  }
}

Response Error (401):
{
  "success": false,
  "message": "Invalid credentials"
}
*/
