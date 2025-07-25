"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import axios from "axios"

const DashboardContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  margin: 0 auto;
  padding: 2rem;
  background: #D5C099;
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

const LogoutButton = styled.button`
  background: #692A11;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: #c82333;
  }
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
`

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #7A5328;
`

const StatLabel = styled.div`
  color: #666;
  margin-top: 0.5rem;
`

const OrdersContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`

const OrdersHeader = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`

const OrdersList = styled.div`
  max-height: 600px;
  overflow-y: auto;
`

const OrderCard = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`

const OrderId = styled.span`
  font-weight: bold;
  color: #007bff;
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
      default:
        return "background: #e2e3e5; color: #383d41;"
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

const NoOrders = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
`

const AdminDashboard = ({ onLogout }) => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, statusFilter])

  const loadOrders = async () => {
    const response = await axios.get("http://localhost:8080/projects");
    console.log(response.data)
    const storedOrders = response.data.map((order) => ({
      ...order,
      createdAt: order.createdAt || new Date().toISOString(),
      updatedAt: order.updatedAt || new Date().toISOString(),
    }))

    setOrders(storedOrders)
  }

  const filterOrders = () => {
    if (statusFilter === "all") {
      setFilteredOrders(orders)
    } else {
      setFilteredOrders(orders.filter((order) => order.status === statusFilter))
    }
  }

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } : order,
    )

    setOrders(updatedOrders)
    localStorage.setItem("orders", JSON.stringify(updatedOrders))
  }

  const getStats = () => {
    const total = orders.length
    const pending = orders.filter((o) => o.status === "pending").length
    const inProgress = orders.filter((o) => o.status === "in-progress").length
    const completed = orders.filter((o) => o.status === "completed").length

    return { total, pending, inProgress, completed }
  }

  const stats = getStats()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>Admin Dashboard</Title>
        <LogoutButton onClick={onLogout}>Logout</LogoutButton>
      </Header>

      <StatsContainer>
        <StatCard>
          <StatNumber>{stats.total}</StatNumber>
          <StatLabel>Total Orders</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.pending}</StatNumber>
          <StatLabel>Pending</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.inProgress}</StatNumber>
          <StatLabel>In Progress</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.completed}</StatNumber>
          <StatLabel>Completed</StatLabel>
        </StatCard>
      </StatsContainer>

      <OrdersContainer>
        <OrdersHeader>
          <h3>Orders</h3>
          <FilterSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </FilterSelect>
        </OrdersHeader>

        <OrdersList>
          {filteredOrders.length === 0 ? (
            <NoOrders>No orders found</NoOrders>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard key={order.id}>
                <OrderHeader>
                  <OrderId>{order.id}</OrderId>
                  <StatusSelect value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </StatusSelect>
                </OrderHeader>

                <StatusBadge status={order.status}>{order.status.toUpperCase()}</StatusBadge>

                <OrderDetails>
                  <DetailItem>
                    <DetailLabel>Client: </DetailLabel>
                    {order.clientName}
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Email: </DetailLabel>
                    {order.email}
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Project: </DetailLabel>
                    {order.projectTitle}
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Type: </DetailLabel>
                    {order.projectType}
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Budget: </DetailLabel>
                    {order.budget}
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Deadline: </DetailLabel>
                    {order.deadline ? formatDate(order.deadline) : "Not specified"}
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Services: </DetailLabel>
                    {order.services.join(", ")}
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Created: </DetailLabel>
                    {formatDate(order.createdAt)}
                  </DetailItem>
                </OrderDetails>

                {order.description && (
                  <DetailItem style={{ marginTop: "1rem" }}>
                    <DetailLabel>Description: </DetailLabel>
                    <div style={{ marginTop: "0.5rem", color: "#666" }}>{order.description}</div>
                  </DetailItem>
                )}
              </OrderCard>
            ))
          )}
        </OrdersList>
      </OrdersContainer>
    </DashboardContainer>
  )
}

export default AdminDashboard
