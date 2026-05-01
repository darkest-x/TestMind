package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"testmind/models"
	"testmind/service"
)

type UserController struct {
	userService *service.UserService
}

func NewUserController(userService *service.UserService) *UserController {
	return &UserController{
		userService: userService,
	}
}

// GetAllUsers 获取所有用户
func (c *UserController) GetAllUsers(ctx *gin.Context) {
	users, err := c.userService.FindAllUsers()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "获取用户失败",
		})
		return
	}

	userResponses := make([]UserResponse, 0, len(users))
	for _, user := range users {
		userResponses = append(userResponses, UserResponse{
			ID:        user.ID,
			Username:  user.Username,
			Email:     user.Email,
			FirstName: user.FirstName,
			LastName:  user.LastName,
			Active:    user.Active,
		})
	}

	ctx.JSON(http.StatusOK, userResponses)
}

// GetUserByID 根据ID获取用户
func (c *UserController) GetUserByID(ctx *gin.Context) {
	idParam := ctx.Param("id")
	id, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "无效的用户ID",
		})
		return
	}

	user, err := c.userService.FindUserByID(id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "获取用户失败",
		})
		return
	}

	if user == nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"error": "用户不存在",
		})
		return
	}

	ctx.JSON(http.StatusOK, UserResponse{
		ID:        user.ID,
		Username:  user.Username,
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Active:    user.Active,
	})
}

// CreateUser 创建新用户
func (c *UserController) CreateUser(ctx *gin.Context) {
	var req CreateUserRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "无效的请求参数",
		})
		return
	}

	user := &models.User{
		Username:  req.Username,
		Email:     req.Email,
		Password:  req.Password,
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Active:    true,
	}

	createdUser, err := c.userService.CreateUser(user)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusCreated, UserResponse{
		ID:        createdUser.ID,
		Username:  createdUser.Username,
		Email:     createdUser.Email,
		FirstName: createdUser.FirstName,
		LastName:  createdUser.LastName,
		Active:    createdUser.Active,
	})
}

// UpdateUser 更新用户信息
func (c *UserController) UpdateUser(ctx *gin.Context) {
	idParam := ctx.Param("id")
	id, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "无效的用户ID",
		})
		return
	}

	var req UpdateUserRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "无效的请求参数",
		})
		return
	}

	existingUser, err := c.userService.FindUserByID(id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "获取用户失败",
		})
		return
	}

	if existingUser == nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"error": "用户不存在",
		})
		return
	}

	if req.Username != "" {
		existingUser.Username = req.Username
	}
	if req.Email != "" {
		existingUser.Email = req.Email
	}
	if req.FirstName != "" {
		existingUser.FirstName = req.FirstName
	}
	if req.LastName != "" {
		existingUser.LastName = req.LastName
	}
	if req.Active != nil {
		existingUser.Active = *req.Active
	}

	updatedUser, err := c.userService.UpdateUser(id, existingUser)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, UserResponse{
		ID:        updatedUser.ID,
		Username:  updatedUser.Username,
		Email:     updatedUser.Email,
		FirstName: updatedUser.FirstName,
		LastName:  updatedUser.LastName,
		Active:    updatedUser.Active,
	})
}

// DeleteUser 删除用户
func (c *UserController) DeleteUser(ctx *gin.Context) {
	idParam := ctx.Param("id")
	id, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "无效的用户ID",
		})
		return
	}

	existingUser, err := c.userService.FindUserByID(id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "获取用户失败",
		})
		return
	}

	if existingUser == nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"error": "用户不存在",
		})
		return
	}

	err = c.userService.DeleteUser(id)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	ctx.Status(http.StatusNoContent)
}

// ActivateUser 激活用户
func (c *UserController) ActivateUser(ctx *gin.Context) {
	idParam := ctx.Param("id")
	id, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "无效的用户ID",
		})
		return
	}

	user, err := c.userService.FindUserByID(id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "获取用户失败",
		})
		return
	}

	if user == nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"error": "用户不存在",
		})
		return
	}

	user.Active = true
	updatedUser, err := c.userService.UpdateUser(id, user)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "更新用户失败",
		})
		return
	}

	ctx.JSON(http.StatusOK, UserResponse{
		ID:        updatedUser.ID,
		Username:  updatedUser.Username,
		Email:     updatedUser.Email,
		FirstName: updatedUser.FirstName,
		LastName:  updatedUser.LastName,
		Active:    updatedUser.Active,
	})
}

// DeactivateUser 停用用户
func (c *UserController) DeactivateUser(ctx *gin.Context) {
	idParam := ctx.Param("id")
	id, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "无效的用户ID",
		})
		return
	}

	user, err := c.userService.FindUserByID(id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "获取用户失败",
		})
		return
	}

	if user == nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"error": "用户不存在",
		})
		return
	}

	user.Active = false
	updatedUser, err := c.userService.UpdateUser(id, user)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "更新用户失败",
		})
		return
	}

	ctx.JSON(http.StatusOK, UserResponse{
		ID:        updatedUser.ID,
		Username:  updatedUser.Username,
		Email:     updatedUser.Email,
		FirstName: updatedUser.FirstName,
		LastName:  updatedUser.LastName,
		Active:    updatedUser.Active,
	})
}

// SearchUserByEmail 根据邮箱搜索用户
func (c *UserController) SearchUserByEmail(ctx *gin.Context) {
	email := ctx.Query("email")
	if email == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "邮箱参数不能为空",
		})
		return
	}

	user, err := c.userService.FindUserByEmail(email)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "搜索用户失败",
		})
		return
	}

	if user == nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"error": "用户不存在",
		})
		return
	}

	ctx.JSON(http.StatusOK, UserResponse{
		ID:        user.ID,
		Username:  user.Username,
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Active:    user.Active,
	})
}

// UserResponse 用户响应
type UserResponse struct {
	ID        int64  `json:"id"`
	Username  string `json:"username"`
	Email     string `json:"email"`
	FirstName string `json:"firstName,omitempty"`
	LastName  string `json:"lastName,omitempty"`
	Active    bool   `json:"active"`
}

// CreateUserRequest 创建用户请求
type CreateUserRequest struct {
	Username  string `json:"username" binding:"required"`
	Email     string `json:"email" binding:"required,email"`
	Password  string `json:"password" binding:"required"`
	FirstName string `json:"firstName,omitempty"`
	LastName  string `json:"lastName,omitempty"`
}

// UpdateUserRequest 更新用户请求
type UpdateUserRequest struct {
	Username  string `json:"username,omitempty"`
	Email     string `json:"email,omitempty"`
	FirstName string `json:"firstName,omitempty"`
	LastName  string `json:"lastName,omitempty"`
	Active    *bool  `json:"active,omitempty"`
}
