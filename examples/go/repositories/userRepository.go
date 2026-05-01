package repositories

import (
	"errors"
	"sync"

	"testmind/models"
)

type UserRepository struct {
	users map[int64]*models.User
	mu    sync.RWMutex
	nextID int64
}

func NewUserRepository() *UserRepository {
	return &UserRepository{
		users: make(map[int64]*models.User),
		nextID: 1,
	}
}

func (r *UserRepository) FindByID(id int64) (*models.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	
	user, exists := r.users[id]
	if !exists {
		return nil, errors.New("用户不存在")
	}
	return user, nil
}

func (r *UserRepository) FindAll() ([]*models.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	
	users := make([]*models.User, 0, len(r.users))
	for _, user := range r.users {
		users = append(users, user)
	}
	return users, nil
}

func (r *UserRepository) Save(user *models.User) (*models.User, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	
	if user.ID == 0 {
		user.ID = r.nextID
		r.nextID++
	}
	
	r.users[user.ID] = user
	return user, nil
}

func (r *UserRepository) DeleteByID(id int64) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	
	delete(r.users, id)
	return nil
}

func (r *UserRepository) FindByEmail(email string) (*models.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	
	for _, user := range r.users {
		if user.Email == email {
			return user, nil
		}
	}
	return nil, errors.New("用户不存在")
}

func (r *UserRepository) FindByUsername(username string) (*models.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	
	for _, user := range r.users {
		if user.Username == username {
			return user, nil
		}
	}
	return nil, errors.New("用户不存在")
}
