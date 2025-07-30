
export const API_CONFIG = {
  baseUrl: "http://localhost:8080",
  endpoints: {
    orders: "/api/orders",
    orderById: (id) => `/api/orders/${id}`,
    clients: "/api/clients",
    auth: {
      login: "/api/auth/login",
    },
  },
  // Set to false to use only localStorage (dummy data)
  useAPI: true,
  // Timeout for API calls (ms)
  timeout: 10000,
}

// API utility functions
export const apiCall = async (endpoint, options = {}) => {
  const { timeout = API_CONFIG.timeout } = options

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}
