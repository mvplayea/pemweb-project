package main

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

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
	Status          string `json:"status" db:"status"` // New field for project status
}

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
	Status          string   `json:"status"` // New field for project status
}

var db *sql.DB

func initDB() {
	var err error
	db, err = sql.Open("sqlite3", "./projects.db")
	if err != nil {
		panic(err)
	}

	createTable := `
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
		status TEXT DEFAULT 'pending'
	);`

	_, err = db.Exec(createTable)
	if err != nil {
		panic(err)
	}
}

func createProject(c *gin.Context) {
	var req ProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Convert services array to JSON string
	servicesJSON, _ := json.Marshal(req.Services)

	query := `
		INSERT INTO projects (client_name, email, phone, project_type, services, 
		project_title, description, budget, deadline, reference_files, additional_notes, status)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	result, err := db.Exec(query, req.ClientName, req.Email, req.Phone, req.ProjectType,
		string(servicesJSON), req.ProjectTitle, req.Description, req.Budget,
		req.Deadline, req.ReferenceFiles, req.AdditionalNotes, req.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	id, _ := result.LastInsertId()
	c.JSON(http.StatusCreated, gin.H{"id": id, "message": "Project created successfully"})
}

func getProjects(c *gin.Context) {
	rows, err := db.Query("SELECT * FROM projects")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var projects []map[string]interface{}

	for rows.Next() {
		var p Project
		err := rows.Scan(&p.ID, &p.ClientName, &p.Email, &p.Phone, &p.ProjectType,
			&p.Services, &p.ProjectTitle, &p.Description, &p.Budget,
			&p.Deadline, &p.ReferenceFiles, &p.AdditionalNotes, &p.Status)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Parse services JSON back to array
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
			"status":          p.Status, // Include status in the response
		}
		projects = append(projects, project)
	}

	c.JSON(http.StatusOK, projects)
}

func getProject(c *gin.Context) {
	id := c.Param("id")

	var p Project
	err := db.QueryRow("SELECT * FROM projects WHERE id = ?", id).Scan(
		&p.ID, &p.ClientName, &p.Email, &p.Phone, &p.ProjectType,
		&p.Services, &p.ProjectTitle, &p.Description, &p.Budget,
		&p.Deadline, &p.ReferenceFiles, &p.AdditionalNotes, &p.Status)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Parse services JSON back to array
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
		"status":          p.Status, // Include status in the response
	}

	c.JSON(http.StatusOK, project)
}

func updateProject(c *gin.Context) {
	id := c.Param("id")
	var req ProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Convert services array to JSON string
	servicesJSON, _ := json.Marshal(req.Services)

	query := `
		UPDATE projects SET client_name=?, email=?, phone=?, project_type=?, services=?,
		project_title=?, description=?, budget=?, deadline=?, reference_files=?, additional_notes=?, status=?
		WHERE id=?`

	result, err := db.Exec(query, req.ClientName, req.Email, req.Phone, req.ProjectType,
		string(servicesJSON), req.ProjectTitle, req.Description, req.Budget,
		req.Deadline, req.ReferenceFiles, req.AdditionalNotes, req.Status, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Project updated successfully"})
}

func deleteProject(c *gin.Context) {
	id := c.Param("id")

	result, err := db.Exec("DELETE FROM projects WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Project deleted successfully"})
}

func main() {
	initDB()
	defer db.Close()

	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Routes
	r.POST("/projects", createProject)
	r.GET("/projects", getProjects)
	r.GET("/projects/:id", getProject)
	r.PUT("/projects/:id", updateProject)
	r.DELETE("/projects/:id", deleteProject)

	r.Run(":8080")
}
