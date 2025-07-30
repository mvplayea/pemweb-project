package main

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

// ====================
// MODELS
// ====================

type Project struct {
	ID              int    `json:"id" db:"id"`
	ClientName      string `json:"clientName" db:"client_name"`
	Email           string `json:"email" db:"email"`
	Phone           string `json:"phone" db:"phone"`
	ProjectType     string `json:"projectType" db:"project_type"`
	Services        string `json:"services" db:"services"` // JSON string
	ProjectTitle    string `json:"projectTitle" db:"project_title"`
	Description     string `json:"description" db:"description"`
	Budget          string `json:"budget" db:"budget"`
	Deadline        string `json:"deadline" db:"deadline"`
	ReferenceFiles  string `json:"referenceFiles" db:"reference_files"`
	AdditionalNotes string `json:"additionalNotes" db:"additional_notes"`
}

type Order struct {
	ID                      string    `json:"id" db:"id"`
	ClientName              string    `json:"clientName" db:"client_name"`
	Email                   string    `json:"email" db:"email"`
	Phone                   string    `json:"phone" db:"phone"`
	Company                 string    `json:"company" db:"company"`
	ProjectType             string    `json:"projectType" db:"project_type"`
	Services                string    `json:"services" db:"services"` // JSON string
	ProjectTitle            string    `json:"projectTitle" db:"project_title"`
	Description             string    `json:"description" db:"description"`
	Budget                  string    `json:"budget" db:"budget"`
	Deadline                string    `json:"deadline" db:"deadline"`
	Priority                string    `json:"priority" db:"priority"`
	Status                  string    `json:"status" db:"status"`
	CommunicationPreference string    `json:"communicationPreference" db:"communication_preference"`
	RevisionRounds          string    `json:"revisionRounds" db:"revision_rounds"`
	FileFormat              string    `json:"fileFormat" db:"file_format"` // JSON string
	ColorPreferences        string    `json:"colorPreferences" db:"color_preferences"`
	TargetAudience          string    `json:"targetAudience" db:"target_audience"`
	AdditionalNotes         string    `json:"additionalNotes" db:"additional_notes"`
	CreatedAt               time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt               time.Time `json:"updatedAt" db:"updated_at"`
}

type Client struct {
	ID            string    `json:"id" db:"id"`
	Name          string    `json:"name" db:"name"`
	Email         string    `json:"email" db:"email"`
	Phone         string    `json:"phone" db:"phone"`
	Company       string    `json:"company" db:"company"`
	TotalOrders   int       `json:"totalOrders" db:"total_orders"`
	TotalSpent    float64   `json:"totalSpent" db:"total_spent"`
	LastOrderDate time.Time `json:"lastOrderDate" db:"last_order_date"`
	CreatedAt     time.Time `json:"createdAt" db:"created_at"`
}

// ====================
// DTOs (Data Transfer Objects)
// ====================

type ProjectRequest struct {
	ClientName      string   `json:"clientName"`
	Email           string   `json:"email"`
	Phone           string   `json:"phone"`
	ProjectType     string   `json:"projectType"`
	Services        []string `json:"services"`
	ProjectTitle    string   `json:"projectTitle"`
	Description     string   `json:"description"`
	Budget          string   `json:"budget"`
	Deadline        string   `json:"deadline"`
	ReferenceFiles  string   `json:"referenceFiles"`
	AdditionalNotes string   `json:"additionalNotes"`
}

type OrderRequest struct {
	ClientName              string   `json:"clientName"`
	Email                   string   `json:"email"`
	Phone                   string   `json:"phone"`
	Company                 string   `json:"company"`
	ProjectType             string   `json:"projectType"`
	Services                []string `json:"services"`
	ProjectTitle            string   `json:"projectTitle"`
	Description             string   `json:"description"`
	Budget                  string   `json:"budget"`
	Deadline                string   `json:"deadline"`
	Priority                string   `json:"priority"`
	Status                  string   `json:"status"`
	CommunicationPreference string   `json:"communicationPreference"`
	RevisionRounds          string   `json:"revisionRounds"`
	FileFormat              []string `json:"fileFormat"`
	ColorPreferences        string   `json:"colorPreferences"`
	TargetAudience          string   `json:"targetAudience"`
	AdditionalNotes         string   `json:"additionalNotes"`
}

type OrderUpdateRequest struct {
	Status string `json:"status"`
}

type PaginationResponse struct {
	Page       int `json:"page"`
	Limit      int `json:"limit"`
	Total      int `json:"total"`
	TotalPages int `json:"totalPages"`
}

type APIResponse struct {
	Success    bool        `json:"success"`
	Data       interface{} `json:"data,omitempty"`
	Message    string      `json:"message,omitempty"`
	Pagination interface{} `json:"pagination,omitempty"`
}

// ====================
// REPOSITORIES
// ====================

type ProjectRepository interface {
	Create(req ProjectRequest) (int64, error)
	GetAll() ([]Project, error)
	GetByID(id int) (*Project, error)
	Update(id int, req ProjectRequest) error
	Delete(id int) error
}

type OrderRepository interface {
	Create(order *Order) error
	GetAll(page, limit int) ([]Order, int, error)
	GetByID(id string) (*Order, error)
	UpdateStatus(id, status string) error
	Delete(id string) error
}

type ClientRepository interface {
	GetAll() ([]Client, error)
	GetByEmail(email string) (*Client, error)
	Create(client *Client) error
	Update(client *Client) error
	IncrementOrderCount(email string) error
}

// Project Repository Implementation
type projectRepository struct {
	db *sql.DB
}

func NewProjectRepository(db *sql.DB) ProjectRepository {
	return &projectRepository{db: db}
}

func (r *projectRepository) Create(req ProjectRequest) (int64, error) {
	servicesJSON, _ := json.Marshal(req.Services)

	query := `
		INSERT INTO projects (client_name, email, phone, project_type, services, 
		project_title, description, budget, deadline, reference_files, additional_notes)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	result, err := r.db.Exec(query, req.ClientName, req.Email, req.Phone, req.ProjectType,
		string(servicesJSON), req.ProjectTitle, req.Description, req.Budget,
		req.Deadline, req.ReferenceFiles, req.AdditionalNotes)
	if err != nil {
		return 0, err
	}

	return result.LastInsertId()
}

func (r *projectRepository) GetAll() ([]Project, error) {
	rows, err := r.db.Query("SELECT * FROM projects")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var projects []Project
	for rows.Next() {
		var p Project
		err := rows.Scan(&p.ID, &p.ClientName, &p.Email, &p.Phone, &p.ProjectType,
			&p.Services, &p.ProjectTitle, &p.Description, &p.Budget,
			&p.Deadline, &p.ReferenceFiles, &p.AdditionalNotes)
		if err != nil {
			return nil, err
		}
		projects = append(projects, p)
	}

	return projects, nil
}

func (r *projectRepository) GetByID(id int) (*Project, error) {
	var p Project
	err := r.db.QueryRow("SELECT * FROM projects WHERE id = ?", id).Scan(
		&p.ID, &p.ClientName, &p.Email, &p.Phone, &p.ProjectType,
		&p.Services, &p.ProjectTitle, &p.Description, &p.Budget,
		&p.Deadline, &p.ReferenceFiles, &p.AdditionalNotes)
	if err != nil {
		return nil, err
	}

	return &p, nil
}

func (r *projectRepository) Update(id int, req ProjectRequest) error {
	servicesJSON, _ := json.Marshal(req.Services)

	query := `
		UPDATE projects SET client_name=?, email=?, phone=?, project_type=?, services=?,
		project_title=?, description=?, budget=?, deadline=?, reference_files=?, additional_notes=?
		WHERE id=?`

	result, err := r.db.Exec(query, req.ClientName, req.Email, req.Phone, req.ProjectType,
		string(servicesJSON), req.ProjectTitle, req.Description, req.Budget,
		req.Deadline, req.ReferenceFiles, req.AdditionalNotes, id)
	if err != nil {
		return err
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return sql.ErrNoRows
	}

	return nil
}

func (r *projectRepository) Delete(id int) error {
	result, err := r.db.Exec("DELETE FROM projects WHERE id = ?", id)
	if err != nil {
		return err
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return sql.ErrNoRows
	}

	return nil
}

// Order Repository Implementation
type orderRepository struct {
	db *sql.DB
}

func NewOrderRepository(db *sql.DB) OrderRepository {
	return &orderRepository{db: db}
}

func (r *orderRepository) Create(order *Order) error {
	query := `
		INSERT INTO orders (id, client_name, email, phone, company, project_type, services, 
		project_title, description, budget, deadline, priority, status, communication_preference,
		revision_rounds, file_format, color_preferences, target_audience, additional_notes,
		created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := r.db.Exec(query, order.ID, order.ClientName, order.Email, order.Phone,
		order.Company, order.ProjectType, order.Services, order.ProjectTitle,
		order.Description, order.Budget, order.Deadline, order.Priority, order.Status,
		order.CommunicationPreference, order.RevisionRounds, order.FileFormat,
		order.ColorPreferences, order.TargetAudience, order.AdditionalNotes,
		order.CreatedAt, order.UpdatedAt)

	return err
}

func (r *orderRepository) GetAll(page, limit int) ([]Order, int, error) {
	// Get total count
	var total int
	err := r.db.QueryRow("SELECT COUNT(*) FROM orders").Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	// Get orders with pagination
	offset := (page - 1) * limit
	rows, err := r.db.Query("SELECT * FROM orders ORDER BY created_at DESC LIMIT ? OFFSET ?", limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var orders []Order
	for rows.Next() {
		var o Order
		err := rows.Scan(&o.ID, &o.ClientName, &o.Email, &o.Phone, &o.Company, &o.ProjectType,
			&o.Services, &o.ProjectTitle, &o.Description, &o.Budget, &o.Deadline, &o.Priority,
			&o.Status, &o.CommunicationPreference, &o.RevisionRounds, &o.FileFormat,
			&o.ColorPreferences, &o.TargetAudience, &o.AdditionalNotes, &o.CreatedAt, &o.UpdatedAt)
		if err != nil {
			return nil, 0, err
		}
		orders = append(orders, o)
	}

	return orders, total, nil
}

func (r *orderRepository) GetByID(id string) (*Order, error) {
	var o Order
	err := r.db.QueryRow("SELECT * FROM orders WHERE id = ?", id).Scan(
		&o.ID, &o.ClientName, &o.Email, &o.Phone, &o.Company, &o.ProjectType,
		&o.Services, &o.ProjectTitle, &o.Description, &o.Budget, &o.Deadline, &o.Priority,
		&o.Status, &o.CommunicationPreference, &o.RevisionRounds, &o.FileFormat,
		&o.ColorPreferences, &o.TargetAudience, &o.AdditionalNotes, &o.CreatedAt, &o.UpdatedAt)
	if err != nil {
		return nil, err
	}

	return &o, nil
}

func (r *orderRepository) UpdateStatus(id, status string) error {
	result, err := r.db.Exec("UPDATE orders SET status = ?, updated_at = ? WHERE id = ?",
		status, time.Now(), id)
	if err != nil {
		return err
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return sql.ErrNoRows
	}

	return nil
}

func (r *orderRepository) Delete(id string) error {
	result, err := r.db.Exec("DELETE FROM orders WHERE id = ?", id)
	if err != nil {
		return err
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return sql.ErrNoRows
	}

	return nil
}

// Client Repository Implementation
type clientRepository struct {
	db *sql.DB
}

func NewClientRepository(db *sql.DB) ClientRepository {
	return &clientRepository{db: db}
}

func (r *clientRepository) GetAll() ([]Client, error) {
	rows, err := r.db.Query(`
		SELECT id, name, email, phone, company, total_orders, total_spent, 
		       last_order_date, created_at
		FROM clients ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var clients []Client
	for rows.Next() {
		var client Client
		var lastOrderDate sql.NullTime

		err := rows.Scan(&client.ID, &client.Name, &client.Email, &client.Phone,
			&client.Company, &client.TotalOrders, &client.TotalSpent,
			&lastOrderDate, &client.CreatedAt)
		if err != nil {
			return nil, err
		}

		if lastOrderDate.Valid {
			client.LastOrderDate = lastOrderDate.Time
		}

		clients = append(clients, client)
	}

	return clients, nil
}

func (r *clientRepository) GetByEmail(email string) (*Client, error) {
	var client Client
	var lastOrderDate sql.NullTime

	err := r.db.QueryRow(`
		SELECT id, name, email, phone, company, total_orders, total_spent, 
		       last_order_date, created_at
		FROM clients WHERE email = ?
	`, email).Scan(&client.ID, &client.Name, &client.Email, &client.Phone,
		&client.Company, &client.TotalOrders, &client.TotalSpent,
		&lastOrderDate, &client.CreatedAt)
	if err != nil {
		return nil, err
	}

	if lastOrderDate.Valid {
		client.LastOrderDate = lastOrderDate.Time
	}

	return &client, nil
}

func (r *clientRepository) Create(client *Client) error {
	_, err := r.db.Exec(`
		INSERT INTO clients (id, name, email, phone, company, total_orders, total_spent, last_order_date, created_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
	`, client.ID, client.Name, client.Email, client.Phone, client.Company,
		client.TotalOrders, client.TotalSpent, client.LastOrderDate, client.CreatedAt)

	return err
}

func (r *clientRepository) Update(client *Client) error {
	_, err := r.db.Exec(`
		UPDATE clients 
		SET name = ?, phone = ?, company = ?, total_orders = ?, last_order_date = ?
		WHERE email = ?
	`, client.Name, client.Phone, client.Company, client.TotalOrders, client.LastOrderDate, client.Email)

	return err
}

func (r *clientRepository) IncrementOrderCount(email string) error {
	_, err := r.db.Exec(`
		UPDATE clients 
		SET total_orders = total_orders + 1, last_order_date = ?
		WHERE email = ?
	`, time.Now(), email)

	return err
}

// ====================
// SERVICES
// ====================

type ProjectService interface {
	CreateProject(req ProjectRequest) (int64, error)
	GetAllProjects() ([]map[string]interface{}, error)
	GetProjectByID(id int) (map[string]interface{}, error)
	UpdateProject(id int, req ProjectRequest) error
	DeleteProject(id int) error
}

type OrderService interface {
	CreateOrder(req OrderRequest) (string, error)
	GetAllOrders(page, limit int) ([]map[string]interface{}, PaginationResponse, error)
	UpdateOrderStatus(id, status string) (map[string]interface{}, error)
	DeleteOrder(id string) error
}

type ClientService interface {
	GetAllClients() ([]Client, error)
}

// Project Service Implementation
type projectService struct {
	repo ProjectRepository
}

func NewProjectService(repo ProjectRepository) ProjectService {
	return &projectService{repo: repo}
}

func (s *projectService) CreateProject(req ProjectRequest) (int64, error) {
	return s.repo.Create(req)
}

func (s *projectService) GetAllProjects() ([]map[string]interface{}, error) {
	projects, err := s.repo.GetAll()
	if err != nil {
		return nil, err
	}

	var result []map[string]interface{}
	for _, p := range projects {
		var services []string
		json.Unmarshal([]byte(p.Services), &services)

		project := map[string]interface{}{
			"id":              p.ID,
			"clientName":      p.ClientName,
			"email":           p.Email,
			"phone":           p.Phone,
			"projectType":     p.ProjectType,
			"services":        services,
			"projectTitle":    p.ProjectTitle,
			"description":     p.Description,
			"budget":          p.Budget,
			"deadline":        p.Deadline,
			"referenceFiles":  p.ReferenceFiles,
			"additionalNotes": p.AdditionalNotes,
		}
		result = append(result, project)
	}

	return result, nil
}

func (s *projectService) GetProjectByID(id int) (map[string]interface{}, error) {
	p, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}

	var services []string
	json.Unmarshal([]byte(p.Services), &services)

	project := map[string]interface{}{
		"id":              p.ID,
		"clientName":      p.ClientName,
		"email":           p.Email,
		"phone":           p.Phone,
		"projectType":     p.ProjectType,
		"services":        services,
		"projectTitle":    p.ProjectTitle,
		"description":     p.Description,
		"budget":          p.Budget,
		"deadline":        p.Deadline,
		"referenceFiles":  p.ReferenceFiles,
		"additionalNotes": p.AdditionalNotes,
	}

	return project, nil
}

func (s *projectService) UpdateProject(id int, req ProjectRequest) error {
	return s.repo.Update(id, req)
}

func (s *projectService) DeleteProject(id int) error {
	return s.repo.Delete(id)
}

// Order Service Implementation
type orderService struct {
	orderRepo  OrderRepository
	clientRepo ClientRepository
}

func NewOrderService(orderRepo OrderRepository, clientRepo ClientRepository) OrderService {
	return &orderService{
		orderRepo:  orderRepo,
		clientRepo: clientRepo,
	}
}

func (s *orderService) CreateOrder(req OrderRequest) (string, error) {
	orderID := generateOrderID()
	servicesJSON, _ := json.Marshal(req.Services)
	fileFormatJSON, _ := json.Marshal(req.FileFormat)
	now := time.Now()

	if req.Status == "" {
		req.Status = "pending"
	}

	order := &Order{
		ID:                      orderID,
		ClientName:              req.ClientName,
		Email:                   req.Email,
		Phone:                   req.Phone,
		Company:                 req.Company,
		ProjectType:             req.ProjectType,
		Services:                string(servicesJSON),
		ProjectTitle:            req.ProjectTitle,
		Description:             req.Description,
		Budget:                  req.Budget,
		Deadline:                req.Deadline,
		Priority:                req.Priority,
		Status:                  req.Status,
		CommunicationPreference: req.CommunicationPreference,
		RevisionRounds:          req.RevisionRounds,
		FileFormat:              string(fileFormatJSON),
		ColorPreferences:        req.ColorPreferences,
		TargetAudience:          req.TargetAudience,
		AdditionalNotes:         req.AdditionalNotes,
		CreatedAt:               now,
		UpdatedAt:               now,
	}

	err := s.orderRepo.Create(order)
	if err != nil {
		return "", err
	}

	// Update client record
	s.updateClientRecord(req.Email, req.ClientName, req.Phone, req.Company)

	return orderID, nil
}

func (s *orderService) GetAllOrders(page, limit int) ([]map[string]interface{}, PaginationResponse, error) {
	orders, total, err := s.orderRepo.GetAll(page, limit)
	if err != nil {
		return nil, PaginationResponse{}, err
	}

	var result []map[string]interface{}
	for _, o := range orders {
		var services []string
		var fileFormat []string
		json.Unmarshal([]byte(o.Services), &services)
		json.Unmarshal([]byte(o.FileFormat), &fileFormat)

		order := map[string]interface{}{
			"id":                      o.ID,
			"clientName":              o.ClientName,
			"email":                   o.Email,
			"phone":                   o.Phone,
			"company":                 o.Company,
			"projectType":             o.ProjectType,
			"services":                services,
			"projectTitle":            o.ProjectTitle,
			"description":             o.Description,
			"budget":                  o.Budget,
			"deadline":                o.Deadline,
			"priority":                o.Priority,
			"status":                  o.Status,
			"communicationPreference": o.CommunicationPreference,
			"revisionRounds":          o.RevisionRounds,
			"fileFormat":              fileFormat,
			"colorPreferences":        o.ColorPreferences,
			"targetAudience":          o.TargetAudience,
			"additionalNotes":         o.AdditionalNotes,
			"createdAt":               o.CreatedAt.Format(time.RFC3339),
			"updatedAt":               o.UpdatedAt.Format(time.RFC3339),
		}
		result = append(result, order)
	}

	totalPages := (total + limit - 1) / limit
	pagination := PaginationResponse{
		Page:       page,
		Limit:      limit,
		Total:      total,
		TotalPages: totalPages,
	}

	return result, pagination, nil
}

func (s *orderService) UpdateOrderStatus(id, status string) (map[string]interface{}, error) {
	err := s.orderRepo.UpdateStatus(id, status)
	if err != nil {
		return nil, err
	}

	// Get updated order
	o, err := s.orderRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	var services []string
	var fileFormat []string
	json.Unmarshal([]byte(o.Services), &services)
	json.Unmarshal([]byte(o.FileFormat), &fileFormat)

	updatedOrder := map[string]interface{}{
		"id":                      o.ID,
		"clientName":              o.ClientName,
		"email":                   o.Email,
		"phone":                   o.Phone,
		"company":                 o.Company,
		"projectType":             o.ProjectType,
		"services":                services,
		"projectTitle":            o.ProjectTitle,
		"description":             o.Description,
		"budget":                  o.Budget,
		"deadline":                o.Deadline,
		"priority":                o.Priority,
		"status":                  o.Status,
		"communicationPreference": o.CommunicationPreference,
		"revisionRounds":          o.RevisionRounds,
		"fileFormat":              fileFormat,
		"colorPreferences":        o.ColorPreferences,
		"targetAudience":          o.TargetAudience,
		"additionalNotes":         o.AdditionalNotes,
		"createdAt":               o.CreatedAt.Format(time.RFC3339),
		"updatedAt":               o.UpdatedAt.Format(time.RFC3339),
	}

	return updatedOrder, nil
}

func (s *orderService) DeleteOrder(id string) error {
	return s.orderRepo.Delete(id)
}

func (s *orderService) updateClientRecord(email, name, phone, company string) {
	client, err := s.clientRepo.GetByEmail(email)

	if err == sql.ErrNoRows {
		// Create new client
		newClient := &Client{
			ID:            generateClientID(),
			Name:          name,
			Email:         email,
			Phone:         phone,
			Company:       company,
			TotalOrders:   1,
			TotalSpent:    0,
			LastOrderDate: time.Now(),
			CreatedAt:     time.Now(),
		}
		s.clientRepo.Create(newClient)
	} else if err == nil {
		// Update existing client
		client.Name = name
		client.Phone = phone
		client.Company = company
		client.TotalOrders++
		client.LastOrderDate = time.Now()
		s.clientRepo.Update(client)
	}
}

// Client Service Implementation
type clientService struct {
	repo ClientRepository
}

func NewClientService(repo ClientRepository) ClientService {
	return &clientService{repo: repo}
}

func (s *clientService) GetAllClients() ([]Client, error) {
	return s.repo.GetAll()
}

// ====================
// HANDLERS/CONTROLLERS
// ====================

type ProjectHandler struct {
	service ProjectService
}

func NewProjectHandler(service ProjectService) *ProjectHandler {
	return &ProjectHandler{service: service}
}

func (h *ProjectHandler) CreateProject(c *gin.Context) {
	var req ProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	id, err := h.service.CreateProject(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"id": id, "message": "Project created successfully"})
}

func (h *ProjectHandler) GetProjects(c *gin.Context) {
	projects, err := h.service.GetAllProjects()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, projects)
}

func (h *ProjectHandler) GetProject(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	project, err := h.service.GetProjectByID(id)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, project)
}

func (h *ProjectHandler) UpdateProject(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var req ProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.service.UpdateProject(id, req)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Project updated successfully"})
}

func (h *ProjectHandler) DeleteProject(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	err := h.service.DeleteProject(id)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Project deleted successfully"})
}

type OrderHandler struct {
	service OrderService
}

func NewOrderHandler(service OrderService) *OrderHandler {
	return &OrderHandler{service: service}
}

func (h *OrderHandler) CreateOrder(c *gin.Context) {
	var req OrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, APIResponse{
			Success: false,
			Message: err.Error(),
		})
		return
	}

	orderID, err := h.service.CreateOrder(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, APIResponse{
			Success: false,
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, APIResponse{
		Success: true,
		Message: "Order created successfully",
		Data:    map[string]string{"id": orderID},
	})
}

func (h *OrderHandler) GetOrders(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))

	orders, pagination, err := h.service.GetAllOrders(page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, APIResponse{
			Success: false,
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, APIResponse{
		Success:    true,
		Data:       orders,
		Pagination: pagination,
	})
}

func (h *OrderHandler) UpdateOrder(c *gin.Context) {
	id := c.Param("id")
	var req OrderUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, APIResponse{
			Success: false,
			Message: err.Error(),
		})
		return
	}

	updatedOrder, err := h.service.UpdateOrderStatus(id, req.Status)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, APIResponse{
			Success: false,
			Message: "Order not found",
		})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, APIResponse{
			Success: false,
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, APIResponse{
		Success: true,
		Message: "Order updated successfully",
		Data:    updatedOrder,
	})
}

func (h *OrderHandler) DeleteOrder(c *gin.Context) {
	id := c.Param("id")

	err := h.service.DeleteOrder(id)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, APIResponse{
			Success: false,
			Message: "Order not found",
		})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, APIResponse{
			Success: false,
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, APIResponse{
		Success: true,
		Message: "Order deleted successfully",
	})
}

type ClientHandler struct {
	service ClientService
}

func NewClientHandler(service ClientService) *ClientHandler {
	return &ClientHandler{service: service}
}

func (h *ClientHandler) GetClients(c *gin.Context) {
	clients, err := h.service.GetAllClients()
	if err != nil {
		c.JSON(http.StatusInternalServerError, APIResponse{
			Success: false,
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, APIResponse{
		Success: true,
		Data:    clients,
	})
}

// ====================
// UTILITIES
// ====================

func generateOrderID() string {
	return "ORD-" + strconv.FormatInt(time.Now().UnixNano(), 10)
}

func generateClientID() string {
	return "CLIENT-" + strconv.FormatInt(time.Now().UnixNano(), 10)
}

func initDB() *sql.DB {
	db, err := sql.Open("sqlite3", "./projects.db")
	if err != nil {
		panic(err)
	}

	// Create projects table
	createProjectsTable := `
	CREATE TABLE IF NOT EXISTS projects (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		client_name TEXT,
		email TEXT,
		phone TEXT,
		project_type TEXT,
		services TEXT,
		project_title TEXT,
		description TEXT,
		budget TEXT,
		deadline TEXT,
		reference_files TEXT,
		additional_notes TEXT
	);`

	// Create orders table
	createOrdersTable := `
	CREATE TABLE IF NOT EXISTS orders (
		id TEXT PRIMARY KEY,
		client_name TEXT,
		email TEXT,
		phone TEXT,
		company TEXT,
		project_type TEXT,
		services TEXT,
		project_title TEXT,
		description TEXT,
		budget TEXT,
		deadline TEXT,
		priority TEXT,
		status TEXT DEFAULT 'pending',
		communication_preference TEXT,
		revision_rounds TEXT,
		file_format TEXT,
		color_preferences TEXT,
		target_audience TEXT,
		additional_notes TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);`

	// Create clients table
	createClientsTable := `
	CREATE TABLE IF NOT EXISTS clients (
		id TEXT PRIMARY KEY,
		name TEXT,
		email TEXT UNIQUE,
		phone TEXT,
		company TEXT,
		total_orders INTEGER DEFAULT 0,
		total_spent REAL DEFAULT 0,
		last_order_date DATETIME,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);`

	tables := []string{createProjectsTable, createOrdersTable, createClientsTable}
	for _, table := range tables {
		_, err = db.Exec(table)
		if err != nil {
			panic(err)
		}
	}

	return db
}

// ====================
// DEPENDENCY INJECTION & MAIN
// ====================

func main() {
	// Initialize database
	db := initDB()
	defer db.Close()

	// Initialize repositories
	projectRepo := NewProjectRepository(db)
	orderRepo := NewOrderRepository(db)
	clientRepo := NewClientRepository(db)

	// Initialize services
	projectService := NewProjectService(projectRepo)
	orderService := NewOrderService(orderRepo, clientRepo)
	clientService := NewClientService(clientRepo)

	projectHandler := NewProjectHandler(projectService)
	orderHandler := NewOrderHandler(orderService)
	clientHandler := NewClientHandler(clientService)

	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Project routes
	r.POST("/projects", projectHandler.CreateProject)
	r.GET("/projects", projectHandler.GetProjects)
	r.GET("/projects/:id", projectHandler.GetProject)
	r.PUT("/projects/:id", projectHandler.UpdateProject)
	r.DELETE("/projects/:id", projectHandler.DeleteProject)

	// Order routes
	r.POST("/api/orders", orderHandler.CreateOrder)
	r.GET("/api/orders", orderHandler.GetOrders)
	r.PATCH("/api/orders/:id", orderHandler.UpdateOrder)
	r.DELETE("/api/orders/:id", orderHandler.DeleteOrder)

	// Client routes
	r.GET("/api/clients", clientHandler.GetClients)

	// Start server
	r.Run(":8080")
}
