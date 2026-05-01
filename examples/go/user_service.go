package service

import (
	"errors"
	"regexp"

	"testmind/models"
	"testmind/repositories"
)

var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$`)

type UserService struct {
	userRepository repositories.UserRepository
}

func NewUserService(userRepo repositories.UserRepository) *UserService {
	return &UserService{
		userRepository: userRepo,
	}
}

func (s *UserService) FindUserByID(id int64) (*models.User, error) {
	if id <= 0 {
		return nil, errors.New("用户ID必须为正数")
	}

	return s.userRepository.FindByID(id)
}

func (s *UserService) FindAllUsers() ([]*models.User, error) {
	return s.userRepository.FindAll()
}

func (s *UserService) CreateUser(user *models.User) (*models.User, error) {
	if user == nil {
		return nil, errors.New("用户信息不能为空")
	}

	if user.Email == "" {
		return nil, errors.New("用户邮箱不能为空")
	}

	if err := s.validateEmailFormat(user.Email); err != nil {
		return nil, err
	}

	return s.userRepository.Save(user)
}

func (s *UserService) UpdateUser(id int64, user *models.User) (*models.User, error) {
	if id <= 0 {
		return nil, errors.New("用户ID必须为正数")
	}

	existingUser, err := s.userRepository.FindByID(id)
	if err != nil {
		return nil, err
	}
	if existingUser == nil {
		return nil, errors.New("用户不存在")
	}

	return s.userRepository.Save(user)
}

func (s *UserService) DeleteUser(id int64) error {
	if id <= 0 {
		return errors.New("用户ID必须为正数")
	}

	return s.userRepository.DeleteByID(id)
}

func (s *UserService) validateEmailFormat(email string) error {
	if !emailRegex.MatchString(email) {
		return errors.New("邮箱格式不正确")
	}
	return nil
}
