"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import { API_CONFIG, apiCall } from "../../../api-config"
import { initializeDummyData, mergeWithDummyData, generateDummyOrders, generateDummyClients } from "./dummy-data"

// Initialize dummy data when component loads
initializeDummyData()

const DashboardContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #eee;
`

const Title = styled.h1`
  color: #333;
`

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`

const LogoutButton = styled.button`
  background: #dc3545;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: #c82333;
  }
`

const RefreshButton = styled.button`
  background: #28a745;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: #218838;
  }
  
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`

const ApiStatusIndicator = styled.div`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  
  ${(props) => {
    switch (props.status) {
      case "api":
        return "background: #d4edda; color: #155724;"
      case "local":
        return "background: #fff3cd; color: #856404;"
      case "mixed":
        return "background: #d1ecf1; color: #0c5460;"
      case "error":
        return "background: #f8d7da; color: #721c24;"
      default:
        return "background: #e2e3e5; color: #383d41;"
    }
  }}
`

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  
  ${(props) =>
    props.trend === "up" &&
    `
    &::after {
      content: '↗';
      position: absolute;
      top: 10px;
      right: 15px;
      color: #28a745;
      font-size: 1.2rem;
    }
  `}
  
  ${(props) =>
    props.trend === "down" &&
    `
    &::after {
      content: '↘';
      position: absolute;
      top: 10px;
      right: 15px;
      color: #dc3545;
      font-size: 1.2rem;
    }
  `}
`

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
`

const StatLabel = styled.div`
  color: #666;
  margin-top: 0.5rem;
`

const StatSubtext = styled.div`
  font-size: 0.8rem;
  color: #999;
  margin-top: 0.25rem;
`

const TabsContainer = styled.div`
  margin-bottom: 2rem;
`

const TabsList = styled.div`
  display: flex;
  border-bottom: 2px solid #eee;
  margin-bottom: 1rem;
`

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
  
  ${(props) =>
    props.active &&
    `
    border-bottom-color: #007bff;
    color: #007bff;
    font-weight: 600;
  `}
  
  &:hover {
    background: #f8f9fa;
  }
`

const ContentContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`

const ContentHeader = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`

const SearchInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 200px;
`

const OrdersList = styled.div`
  max-height: 600px;
  overflow-y: auto;
`

const OrderCard = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #eee;
  transition: background-color 0.3s;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
`

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`

const OrderId = styled.span`
  font-weight: bold;
  color: #007bff;
`

const OrderActions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  
  ${(props) => {
    switch (props.status) {
      case "pending":
        return "background: #fff3cd; color: #856404;"
      case "in-progress":
        return "background: #d1ecf1; color: #0c5460;"
      case "completed":
        return "background: #d4edda; color: #155724;"
      case "cancelled":
        return "background: #f8d7da; color: #721c24;"
      case "on-hold":
        return "background: #ffeaa7; color: #6c5ce7;"
      default:
        return "background: #e2e3e5; color: #383d41;"
    }
  }}
`

const PriorityBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: 0.5rem;
  
  ${(props) => {
    switch (props.priority) {
      case "urgent":
        return "background: #dc3545; color: white;"
      case "high":
        return "background: #fd7e14; color: white;"
      case "normal":
        return "background: #28a745; color: white;"
      case "low":
        return "background: #6c757d; color: white;"
      default:
        return "background: #e9ecef; color: #495057;"
    }
  }}
`

const OrderDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`

const DetailItem = styled.div`
  font-size: 0.9rem;
`

const DetailLabel = styled.span`
  font-weight: 600;
  color: #666;
`

const StatusSelect = styled.select`
  padding: 0.25rem 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.8rem;
`

const ActionButton = styled.button`
  padding: 0.25rem 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  background: white;
  
  &:hover {
    background: #f8f9fa;
  }
`

const NoData = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
`

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-radius: 50%;
  border-top-color: #007bff;
  animation: spin 1s ease-in-out infinite;
  margin: 2rem auto;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`

const RevenueChart = styled.div`
  padding: 2rem;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  margin-bottom: 1rem;
`

const ClientsList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`

const ClientCard = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
`

// Utility functions for null safety
const safeString = (value) => value || ""
const safeArray = (value) => (Array.isArray(value) ? value : [])
const safeNumber = (value) => (typeof value === "number" ? value : 0)

const AdminDashboard = ({ onLogout }) => {
  const [orders, setOrders] = useState([])
  const [clients, setClients] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("orders")
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [dataSource, setDataSource] = useState("unknown")

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, statusFilter, priorityFilter, searchTerm])

  const loadFromAPI = async () => {
    try {
      // Load orders from API
      const ordersResponse = await apiCall(API_CONFIG.endpoints.orders)
      const apiOrders = ordersResponse?.success ? safeArray(ordersResponse.data) : []

      // Load clients from API
      const clientsResponse = await apiCall(API_CONFIG.endpoints.clients)
      const apiClients = clientsResponse?.success ? safeArray(clientsResponse.data) : []

      return { apiOrders, apiClients }
    } catch (error) {
      console.warn("API load failed:", error.message)
      throw error
    }
  }

  const loadFromLocalStorage = () => {
    try {
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      const storedClients = JSON.parse(localStorage.getItem("clients") || "[]")

      return {
        localOrders: safeArray(storedOrders),
        localClients: safeArray(storedClients),
      }
    } catch (error) {
      console.error("LocalStorage load failed:", error)
      return {
        localOrders: generateDummyOrders(),
        localClients: generateDummyClients(),
      }
    }
  }

  const normalizeOrder = (order) => ({
    id: safeString(order?.id) || `ORD-${Date.now()}-${Math.random()}`,
    clientName: safeString(order?.clientName),
    email: safeString(order?.email),
    phone: safeString(order?.phone),
    company: safeString(order?.company),
    projectType: safeString(order?.projectType),
    services: safeArray(order?.services),
    projectTitle: safeString(order?.projectTitle),
    description: safeString(order?.description),
    budget: safeString(order?.budget),
    deadline: safeString(order?.deadline),
    priority: safeString(order?.priority) || "normal",
    status: safeString(order?.status) || "pending",
    communicationPreference: safeString(order?.communicationPreference) || "email",
    revisionRounds: safeString(order?.revisionRounds) || "3",
    fileFormat: safeArray(order?.fileFormat),
    colorPreferences: safeString(order?.colorPreferences),
    targetAudience: safeString(order?.targetAudience),
    additionalNotes: safeString(order?.additionalNotes),
    createdAt: safeString(order?.createdAt) || new Date().toISOString(),
    updatedAt: safeString(order?.updatedAt) || new Date().toISOString(),
  })

  const normalizeClient = (client) => ({
    id: safeString(client?.id) || `CLIENT-${Date.now()}-${Math.random()}`,
    name: safeString(client?.name) || "Unknown Client",
    email: safeString(client?.email),
    phone: safeString(client?.phone),
    company: safeString(client?.company),
    totalOrders: safeNumber(client?.totalOrders),
    totalSpent: safeNumber(client?.totalSpent),
    lastOrderDate: safeString(client?.lastOrderDate) || new Date().toISOString(),
    createdAt: safeString(client?.createdAt) || new Date().toISOString(),
  })

  const loadData = async () => {
    setLoading(true)
    try {
      let finalOrders = []
      let finalClients = []
      let source = "local"

      // Always load local data first
      const { localOrders, localClients } = loadFromLocalStorage()

      if (API_CONFIG.useAPI) {
        try {
          // Try to load from API
          const { apiOrders, apiClients } = await loadFromAPI()

          // Merge API data with local data
          finalOrders = mergeWithDummyData(apiOrders, localOrders, "id")
          finalClients = mergeWithDummyData(apiClients, localClients, "id")

          source =
            apiOrders.length > 0 || apiClients.length > 0
              ? localOrders.length > 0 || localClients.length > 0
                ? "mixed"
                : "api"
              : "local"
        } catch (apiError) {
          console.warn("API failed, using local data only:", apiError.message)
          finalOrders = localOrders
          finalClients = localClients
          source = "local"
        }
      } else {
        finalOrders = localOrders
        finalClients = localClients
        source = "local"
      }

      // Normalize all data
      const normalizedOrders = finalOrders.map(normalizeOrder)
      const normalizedClients = finalClients.map(normalizeClient)

      // Generate clients from orders if no clients exist
      if (normalizedClients.length === 0 && normalizedOrders.length > 0) {
        const generatedClients = normalizedOrders.reduce((acc, order) => {
          if (!order.email) return acc

          const existing = acc.find((c) => c.email === order.email)
          if (!existing) {
            acc.push({
              id: `CLIENT-${Date.now()}-${Math.random()}`,
              name: order.clientName || "Unknown Client",
              email: order.email,
              phone: order.phone || "",
              company: order.company || "",
              totalOrders: 1,
              totalSpent: getBudgetValue(order.budget),
              lastOrderDate: order.createdAt,
              createdAt: order.createdAt,
            })
          } else {
            existing.totalOrders += 1
            existing.totalSpent += getBudgetValue(order.budget)
          }
          return acc
        }, [])

        setClients(generatedClients)
      } else {
        setClients(normalizedClients)
      }

      setOrders(normalizedOrders)
      setDataSource(source)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error loading data:", error)
      setOrders([])
      setClients([])
      setDataSource("error")
    } finally {
      setLoading(false)
    }
  }

  const getBudgetValue = (budgetRange) => {
    const budgetMap = {
      "under-500": 250,
      "500-1000": 750,
      "1000-2500": 1750,
      "2500-5000": 3750,
      "over-5000": 7500,
    }
    return budgetMap[budgetRange] || 0
  }

  const filterOrders = () => {
    let filtered = safeArray(orders)

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => safeString(order?.status) === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((order) => safeString(order?.priority) === priorityFilter)
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (order) =>
          safeString(order?.clientName).toLowerCase().includes(searchLower) ||
          safeString(order?.projectTitle).toLowerCase().includes(searchLower) ||
          safeString(order?.email).toLowerCase().includes(searchLower) ||
          safeString(order?.id).toLowerCase().includes(searchLower),
      )
    }

    setFilteredOrders(filtered)
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      let success = false

      if (API_CONFIG.useAPI) {
        try {
          // Try API first
          const result = await apiCall(API_CONFIG.endpoints.orderById(orderId), {
            method: "PATCH",
            body: JSON.stringify({ status: newStatus }),
          })

          if (result && result.success) {
            success = true
          }
        } catch (apiError) {
          console.warn("API update failed, updating locally:", apiError.message)
        }
      }

      // Always update local data
      const updatedOrders = orders.map((order) =>
        order?.id === orderId ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } : order,
      )
      setOrders(updatedOrders)
      localStorage.setItem("orders", JSON.stringify(updatedOrders))
    } catch (error) {
      console.error("Error updating order:", error)
    }
  }

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return

    try {
      if (API_CONFIG.useAPI) {
        try {
          // Try API first
          const result = await apiCall(API_CONFIG.endpoints.orderById(orderId), {
            method: "DELETE",
          })
        } catch (apiError) {
          console.warn("API delete failed, deleting locally:", apiError.message)
        }
      }

      // Always update local data
      const updatedOrders = orders.filter((order) => order?.id !== orderId)
      setOrders(updatedOrders)
      localStorage.setItem("orders", JSON.stringify(updatedOrders))
    } catch (error) {
      console.error("Error deleting order:", error)
    }
  }

  const getStats = () => {
    const validOrders = safeArray(orders)
    const total = validOrders.length
    const pending = validOrders.filter((o) => safeString(o?.status) === "pending").length
    const inProgress = validOrders.filter((o) => safeString(o?.status) === "in-progress").length
    const completed = validOrders.filter((o) => safeString(o?.status) === "completed").length
    const urgent = validOrders.filter((o) => safeString(o?.priority) === "urgent").length

    const totalRevenue = validOrders
      .filter((o) => safeString(o?.status) === "completed")
      .reduce((sum, order) => sum + getBudgetValue(order?.budget), 0)

    return { total, pending, inProgress, completed, urgent, totalRevenue }
  }

  const stats = getStats()

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return "Invalid Date"
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(safeNumber(amount))
  }

  const renderOrderServices = (services) => {
    if (!services) return "N/A"
    if (Array.isArray(services)) return services.join(", ") || "N/A"
    if (typeof services === "string") return services
    return "N/A"
  }

  const renderOrderFileFormats = (fileFormat) => {
    if (!fileFormat) return "N/A"
    if (Array.isArray(fileFormat)) return fileFormat.join(", ") || "N/A"
    if (typeof fileFormat === "string") return fileFormat
    return "N/A"
  }

  const getDataSourceLabel = () => {
    switch (dataSource) {
      case "api":
        return "API Connected"
      case "local":
        return "Local Storage"
      case "mixed":
        return "API + Local Data"
      case "error":
        return "Connection Error"
      default:
        return "Loading..."
    }
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>Admin Dashboard</Title>
        <HeaderActions>
          <ApiStatusIndicator status={dataSource}>{getDataSourceLabel()}</ApiStatusIndicator>
          <span style={{ fontSize: "0.9rem", color: "#666" }}>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          <RefreshButton onClick={loadData} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </RefreshButton>
          <LogoutButton onClick={onLogout}>Logout</LogoutButton>
        </HeaderActions>
      </Header>

      <StatsContainer>
        <StatCard trend="up">
          <StatNumber>{stats.total}</StatNumber>
          <StatLabel>Total Orders</StatLabel>
          <StatSubtext>+12% from last month</StatSubtext>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.pending}</StatNumber>
          <StatLabel>Pending</StatLabel>
          <StatSubtext>{stats.urgent} urgent</StatSubtext>
        </StatCard>
        <StatCard trend="up">
          <StatNumber>{stats.inProgress}</StatNumber>
          <StatLabel>In Progress</StatLabel>
          <StatSubtext>Active projects</StatSubtext>
        </StatCard>
        <StatCard trend="up">
          <StatNumber>{stats.completed}</StatNumber>
          <StatLabel>Completed</StatLabel>
          <StatSubtext>This month</StatSubtext>
        </StatCard>
        <StatCard trend="up">
          <StatNumber>{formatCurrency(stats.totalRevenue)}</StatNumber>
          <StatLabel>Revenue</StatLabel>
          <StatSubtext>Completed orders</StatSubtext>
        </StatCard>
        <StatCard>
          <StatNumber>{clients.length}</StatNumber>
          <StatLabel>Total Clients</StatLabel>
          <StatSubtext>Active customers</StatSubtext>
        </StatCard>
      </StatsContainer>

      <TabsContainer>
        <TabsList>
          <Tab active={activeTab === "orders"} onClick={() => setActiveTab("orders")}>
            Orders Management
          </Tab>
          <Tab active={activeTab === "clients"} onClick={() => setActiveTab("clients")}>
            Client Management
          </Tab>
          <Tab active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")}>
            Analytics & Reports
          </Tab>
        </TabsList>

        {activeTab === "orders" && (
          <ContentContainer>
            <ContentHeader>
              <h3>Orders Management</h3>
              <FilterContainer>
                <SearchInput
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(safeString(e.target.value))}
                />
                <FilterSelect
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(safeString(e.target.value) || "all")}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="on-hold">On Hold</option>
                </FilterSelect>
                <FilterSelect
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(safeString(e.target.value) || "all")}
                >
                  <option value="all">All Priority</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="normal">Normal</option>
                  <option value="low">Low</option>
                </FilterSelect>
              </FilterContainer>
            </ContentHeader>

            <OrdersList>
              {loading ? (
                <LoadingSpinner />
              ) : filteredOrders.length === 0 ? (
                <NoData>No orders found</NoData>
              ) : (
                filteredOrders.map((order) => (
                  <OrderCard key={order?.id || Math.random()}>
                    <OrderHeader>
                      <div>
                        <OrderId>{safeString(order?.id)}</OrderId>
                        <PriorityBadge priority={safeString(order?.priority) || "normal"}>
                          {(safeString(order?.priority) || "normal").toUpperCase()}
                        </PriorityBadge>
                      </div>
                      <OrderActions>
                        <StatusSelect
                          value={safeString(order?.status) || "pending"}
                          onChange={(e) => updateOrderStatus(order?.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="on-hold">On Hold</option>
                        </StatusSelect>
                        <ActionButton onClick={() => deleteOrder(order?.id)}>Delete</ActionButton>
                      </OrderActions>
                    </OrderHeader>

                    <StatusBadge status={safeString(order?.status) || "pending"}>
                      {(safeString(order?.status) || "pending").toUpperCase()}
                    </StatusBadge>

                    <OrderDetails>
                      <DetailItem>
                        <DetailLabel>Client: </DetailLabel>
                        {safeString(order?.clientName) || "N/A"}
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Email: </DetailLabel>
                        {safeString(order?.email) || "N/A"}
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Company: </DetailLabel>
                        {safeString(order?.company) || "N/A"}
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Project: </DetailLabel>
                        {safeString(order?.projectTitle) || "N/A"}
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Type: </DetailLabel>
                        {safeString(order?.projectType) || "N/A"}
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Budget: </DetailLabel>
                        {safeString(order?.budget) || "N/A"}
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Deadline: </DetailLabel>
                        {order?.deadline ? formatDate(order.deadline) : "Not specified"}
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Communication: </DetailLabel>
                        {safeString(order?.communicationPreference) || "email"}
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Revisions: </DetailLabel>
                        {safeString(order?.revisionRounds) || "3"}
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Services: </DetailLabel>
                        {renderOrderServices(order?.services)}
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>File Formats: </DetailLabel>
                        {renderOrderFileFormats(order?.fileFormat)}
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Created: </DetailLabel>
                        {formatDate(order?.createdAt)}
                      </DetailItem>
                    </OrderDetails>

                    {order?.description && (
                      <DetailItem style={{ marginTop: "1rem" }}>
                        <DetailLabel>Description: </DetailLabel>
                        <div style={{ marginTop: "0.5rem", color: "#666" }}>{safeString(order.description)}</div>
                      </DetailItem>
                    )}
                  </OrderCard>
                ))
              )}
            </OrdersList>
          </ContentContainer>
        )}

        {activeTab === "clients" && (
          <ContentContainer>
            <ContentHeader>
              <h3>Client Management</h3>
              <span>{clients.length} total clients</span>
            </ContentHeader>
            <ClientsList>
              {clients.length === 0 ? (
                <NoData>No clients found</NoData>
              ) : (
                clients.map((client) => (
                  <ClientCard key={client?.id || Math.random()}>
                    <div>
                      <div style={{ fontWeight: "bold" }}>{safeString(client?.name) || "Unknown Client"}</div>
                      <div style={{ fontSize: "0.9rem", color: "#666" }}>
                        {safeString(client?.email)} • {safeString(client?.company) || "No company"}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: "bold", color: "#28a745" }}>{formatCurrency(client?.totalSpent)}</div>
                      <div style={{ fontSize: "0.9rem", color: "#666" }}>{safeNumber(client?.totalOrders)} orders</div>
                    </div>
                  </ClientCard>
                ))
              )}
            </ClientsList>
          </ContentContainer>
        )}

        {activeTab === "analytics" && (
          <ContentContainer>
            <ContentHeader>
              <h3>Analytics & Reports</h3>
            </ContentHeader>
            <div style={{ padding: "2rem" }}>
              <RevenueChart>
                <h3>Revenue Overview</h3>
                <div style={{ fontSize: "2rem", margin: "1rem 0" }}>{formatCurrency(stats.totalRevenue)}</div>
                <div>Total revenue from completed projects</div>
              </RevenueChart>

              <div
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}
              >
                <div style={{ background: "#f8f9fa", padding: "1rem", borderRadius: "8px" }}>
                  <h4>Project Types</h4>
                  <div>
                    {Object.entries(
                      orders.reduce((acc, order) => {
                        const type = safeString(order?.projectType) || "unknown"
                        acc[type] = (acc[type] || 0) + 1
                        return acc
                      }, {}),
                    ).map(([type, count]) => (
                      <div key={type} style={{ display: "flex", justifyContent: "space-between", margin: "0.5rem 0" }}>
                        <span>{type}</span>
                        <span>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: "#f8f9fa", padding: "1rem", borderRadius: "8px" }}>
                  <h4>Priority Distribution</h4>
                  <div>
                    {Object.entries(
                      orders.reduce((acc, order) => {
                        const priority = safeString(order?.priority) || "normal"
                        acc[priority] = (acc[priority] || 0) + 1
                        return acc
                      }, {}),
                    ).map(([priority, count]) => (
                      <div
                        key={priority}
                        style={{ display: "flex", justifyContent: "space-between", margin: "0.5rem 0" }}
                      >
                        <span>{priority}</span>
                        <span>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ContentContainer>
        )}
      </TabsContainer>
    </DashboardContainer>
  )
}

export default AdminDashboard
