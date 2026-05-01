package main

import (
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type User struct {
	ID        int64     `json:"id"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	Password  string    `json:"password,omitempty"`
	FirstName string    `json:"firstName,omitempty"`
	LastName  string    `json:"lastName,omitempty"`
	Active    bool      `json:"active"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

var users = []User{
	{ID: 1, Username: "admin", Email: "admin@testmind.com", Password: "password123", FirstName: "Admin", LastName: "User", Active: true},
	{ID: 2, Username: "johndoe", Email: "john@testmind.com", Password: "password123", FirstName: "John", LastName: "Doe", Active: true},
	{ID: 3, Username: "janedoe", Email: "jane@testmind.com", Password: "password123", FirstName: "Jane", LastName: "Doe", Active: false},
}

var nextID int64 = 4

type CreateUserRequest struct {
	Username  string `json:"username" binding:"required,min=3,max=50"`
	Email     string `json:"email" binding:"required,email"`
	Password  string `json:"password" binding:"required,min=6"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

type UpdateUserRequest struct {
	Username  string `json:"username" binding:"min=3,max=50"`
	Email     string `json:"email" binding:"omitempty,email"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Active    *bool  `json:"active"`
}

type ApiResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
	Time    int64       `json:"timestamp"`
}

func main() {
	r := gin.Default()

	r.GET("/api/health", healthCheck)

	r.GET("/api/v1/users", getAllUsers)
	r.GET("/api/v1/users/:id", getUserByID)
	r.GET("/api/v1/users/email/:email", getUserByEmail)
	r.GET("/api/v1/users/username/:username", getUserByUsername)
	r.GET("/api/v1/users/search", searchUsers)
	r.GET("/api/v1/users/active", getActiveUsers)
	r.GET("/api/v1/users/recent", getRecentUsers)
	r.POST("/api/v1/users", createUser)
	r.PUT("/api/v1/users/:id", updateUser)
	r.DELETE("/api/v1/users/:id", deleteUser)
	r.PATCH("/api/v1/users/:id/activate", activateUser)
	r.PATCH("/api/v1/users/:id/deactivate", deactivateUser)

	log.Println("Server starting on port 8080...")
	if err := r.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}

func healthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, ApiResponse{
		Success: true,
		Message: "TestMind Go Service is running",
		Data:    nil,
		Time:    time.Now().UnixMilli(),
	})
}

func getAllUsers(c *gin.Context) {
	c.JSON(http.StatusOK, ApiResponse{
		Success: true,
		Message: "Success",
		Data:    users,
		Time:    time.Now().UnixMilli(),
	})
}

func getUserByID(c *gin.Context) {
	var id int64
	if err := parseID(c.Param("id"), &id); err != nil {
		c.JSON(http.StatusBadRequest, ApiResponse{
			Success: false,
			Message: "Invalid user ID",
			Data:    nil,
			Time:    time.Now().UnixMilli(),
		})
		return
	}

	for _, user := range users {
		if user.ID == id {
			c.JSON(http.StatusOK, ApiResponse{
				Success: true,
				Message: "Success",
				Data:    user,
				Time:    time.Now().UnixMilli(),
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, ApiResponse{
		Success: false,
		Message: "User not found",
		Data:    nil,
		Time:    time.Now().UnixMilli(),
	})
}

func getUserByEmail(c *gin.Context) {
	email := c.Param("email")
	for _, user := range users {
		if user.Email == email {
			c.JSON(http.StatusOK, ApiResponse{
				Success: true,
				Message: "Success",
				Data:    user,
				Time:    time.Now().UnixMilli(),
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, ApiResponse{
		Success: false,
		Message: "User not found",
		Data:    nil,
		Time:    time.Now().UnixMilli(),
	})
}

func getUserByUsername(c *gin.Context) {
	username := c.Param("username")
	for _, user := range users {
		if user.Username == username {
			c.JSON(http.StatusOK, ApiResponse{
				Success: true,
				Message: "Success",
				Data:    user,
				Time:    time.Now().UnixMilli(),
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, ApiResponse{
		Success: false,
		Message: "User not found",
		Data:    nil,
		Time:    time.Now().UnixMilli(),
	})
}

func searchUsers(c *gin.Context) {
	keyword := c.Query("keyword")
	var results []User

	for _, user := range users {
		if contains(user.Username, keyword) || contains(user.Email, keyword) || contains(user.FirstName, keyword) || contains(user.LastName, keyword) {
			results = append(results, user)
		}
	}

	c.JSON(http.StatusOK, ApiResponse{
		Success: true,
		Message: "Success",
		Data:    results,
		Time:    time.Now().UnixMilli(),
	})
}

func getActiveUsers(c *gin.Context) {
	var activeUsers []User
	for _, user := range users {
		if user.Active {
			activeUsers = append(activeUsers, user)
		}
	}

	c.JSON(http.StatusOK, ApiResponse{
		Success: true,
		Message: "Success",
		Data:    activeUsers,
		Time:    time.Now().UnixMilli(),
	})
}

func getRecentUsers(c *gin.Context) {
	count := len(users)
	if count > 10 {
		count = 10
	}
	c.JSON(http.StatusOK, ApiResponse{
		Success: true,
		Message: "Success",
		Data:    users[len(users)-count:],
		Time:    time.Now().UnixMilli(),
	})
}

func createUser(c *gin.Context) {
	var req CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ApiResponse{
			Success: false,
			Message: err.Error(),
			Data:    nil,
			Time:    time.Now().UnixMilli(),
		})
		return
	}

	for _, user := range users {
		if user.Email == req.Email {
			c.JSON(http.StatusConflict, ApiResponse{
				Success: false,
				Message: "Email already exists",
				Data:    nil,
				Time:    time.Now().UnixMilli(),
			})
			return
		}
		if user.Username == req.Username {
			c.JSON(http.StatusConflict, ApiResponse{
				Success: false,
				Message: "Username already exists",
				Data:    nil,
				Time:    time.Now().UnixMilli(),
			})
			return
		}
	}

	newUser := User{
		ID:        nextID,
		Username:  req.Username,
		Email:     req.Email,
		Password:  req.Password,
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Active:    true,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	nextID++

	users = append(users, newUser)

	c.JSON(http.StatusCreated, ApiResponse{
		Success: true,
		Message: "User created successfully",
		Data:    newUser,
		Time:    time.Now().UnixMilli(),
	})
}

func updateUser(c *gin.Context) {
	var id int64
	if err := parseID(c.Param("id"), &id); err != nil {
		c.JSON(http.StatusBadRequest, ApiResponse{
			Success: false,
			Message: "Invalid user ID",
			Data:    nil,
			Time:    time.Now().UnixMilli(),
		})
		return
	}

	var req UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ApiResponse{
			Success: false,
			Message: err.Error(),
			Data:    nil,
			Time:    time.Now().UnixMilli(),
		})
		return
	}

	for i, user := range users {
		if user.ID == id {
			if req.Email != "" && req.Email != user.Email {
				for _, u := range users {
					if u.Email == req.Email {
						c.JSON(http.StatusConflict, ApiResponse{
							Success: false,
							Message: "Email already exists",
							Data:    nil,
							Time:    time.Now().UnixMilli(),
						})
						return
					}
				}
			}

			if req.Username != "" && req.Username != user.Username {
				for _, u := range users {
					if u.Username == req.Username {
						c.JSON(http.StatusConflict, ApiResponse{
							Success: false,
							Message: "Username already exists",
							Data:    nil,
							Time:    time.Now().UnixMilli(),
						})
						return
					}
				}
			}

			if req.Username != "" {
				users[i].Username = req.Username
			}
			if req.Email != "" {
				users[i].Email = req.Email
			}
			if req.FirstName != "" {
				users[i].FirstName = req.FirstName
			}
			if req.LastName != "" {
				users[i].LastName = req.LastName
			}
			if req.Active != nil {
				users[i].Active = *req.Active
			}
			users[i].UpdatedAt = time.Now()

			c.JSON(http.StatusOK, ApiResponse{
				Success: true,
				Message: "User updated successfully",
				Data:    users[i],
				Time:    time.Now().UnixMilli(),
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, ApiResponse{
		Success: false,
		Message: "User not found",
		Data:    nil,
		Time:    time.Now().UnixMilli(),
	})
}

func deleteUser(c *gin.Context) {
	var id int64
	if err := parseID(c.Param("id"), &id); err != nil {
		c.JSON(http.StatusBadRequest, ApiResponse{
			Success: false,
			Message: "Invalid user ID",
			Data:    nil,
			Time:    time.Now().UnixMilli(),
		})
		return
	}

	for i, user := range users {
		if user.ID == id {
			users = append(users[:i], users[i+1:]...)
			c.JSON(http.StatusOK, ApiResponse{
				Success: true,
				Message: "User deleted successfully",
				Data:    nil,
				Time:    time.Now().UnixMilli(),
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, ApiResponse{
		Success: false,
		Message: "User not found",
		Data:    nil,
		Time:    time.Now().UnixMilli(),
	})
}

func activateUser(c *gin.Context) {
	var id int64
	if err := parseID(c.Param("id"), &id); err != nil {
		c.JSON(http.StatusBadRequest, ApiResponse{
			Success: false,
			Message: "Invalid user ID",
			Data:    nil,
			Time:    time.Now().UnixMilli(),
		})
		return
	}

	for i, user := range users {
		if user.ID == id {
			users[i].Active = true
			users[i].UpdatedAt = time.Now()
			c.JSON(http.StatusOK, ApiResponse{
				Success: true,
				Message: "User activated successfully",
				Data:    users[i],
				Time:    time.Now().UnixMilli(),
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, ApiResponse{
		Success: false,
		Message: "User not found",
		Data:    nil,
		Time:    time.Now().UnixMilli(),
	})
}

func deactivateUser(c *gin.Context) {
	var id int64
	if err := parseID(c.Param("id"), &id); err != nil {
		c.JSON(http.StatusBadRequest, ApiResponse{
			Success: false,
			Message: "Invalid user ID",
			Data:    nil,
			Time:    time.Now().UnixMilli(),
		})
		return
	}

	for i, user := range users {
		if user.ID == id {
			users[i].Active = false
			users[i].UpdatedAt = time.Now()
			c.JSON(http.StatusOK, ApiResponse{
				Success: true,
				Message: "User deactivated successfully",
				Data:    users[i],
				Time:    time.Now().UnixMilli(),
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, ApiResponse{
		Success: false,
		Message: "User not found",
		Data:    nil,
		Time:    time.Now().UnixMilli(),
	})
}

func parseID(idStr string, id *int64) error {
	_, err := fmt.Sscanf(idStr, "%d", id)
	return err
}

func contains(s, substr string) bool {
	return len(strings.TrimSpace(substr)) > 0 && strings.Contains(strings.ToLower(s), strings.ToLower(substr))
}
