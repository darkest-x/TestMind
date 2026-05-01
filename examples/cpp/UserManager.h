#ifndef USERMANAGER_H
#define USERMANAGER_H

#include <string>
#include <vector>
#include <unordered_map>
#include <memory>
#include <mutex>

namespace testmind {

/**
 * 用户实体类
 */
class User {
public:
    User() : id_(0), active_(true) {}
    
    User(const std::string& username, const std::string& email, const std::string& password)
        : id_(0), username_(username), email_(email), password_(password), active_(true) {}
    
    // Getters
    long getId() const { return id_; }
    const std::string& getUsername() const { return username_; }
    const std::string& getEmail() const { return email_; }
    const std::string& getPassword() const { return password_; }
    const std::string& getFirstName() const { return firstName_; }
    const std::string& getLastName() const { return lastName_; }
    bool isActive() const { return active_; }
    
    // Setters
    void setId(long id) { id_ = id; }
    void setUsername(const std::string& username) { username_ = username; }
    void setEmail(const std::string& email) { email_ = email; }
    void setPassword(const std::string& password) { password_ = password; }
    void setFirstName(const std::string& firstName) { firstName_ = firstName; }
    void setLastName(const std::string& lastName) { lastName_ = lastName; }
    void setActive(bool active) { active_ = active; }
    
    std::string getFullName() const {
        if (!firstName_.empty() && !lastName_.empty()) {
            return firstName_ + " " + lastName_;
        } else if (!firstName_.empty()) {
            return firstName_;
        } else if (!lastName_.empty()) {
            return lastName_;
        }
        return username_;
    }
    
private:
    long id_;
    std::string username_;
    std::string email_;
    std::string password_;
    std::string firstName_;
    std::string lastName_;
    bool active_;
};

/**
 * 用户管理器类
 * 提供用户管理功能
 */
class UserManager {
public:
    UserManager() : nextId_(1) {}
    
    /**
     * 根据ID查找用户
     */
    std::shared_ptr<User> findUserById(long id) {
        std::lock_guard<std::mutex> lock(mutex_);
        auto it = users_.find(id);
        if (it != users_.end()) {
            return it->second;
        }
        return nullptr;
    }
    
    /**
     * 获取所有用户
     */
    std::vector<std::shared_ptr<User>> findAllUsers() {
        std::lock_guard<std::mutex> lock(mutex_);
        std::vector<std::shared_ptr<User>> users;
        users.reserve(users_.size());
        for (auto& pair : users_) {
            users.push_back(pair.second);
        }
        return users;
    }
    
    /**
     * 创建新用户
     */
    std::shared_ptr<User> createUser(const User& user) {
        if (user.getEmail().empty()) {
            return nullptr;
        }
        
        if (!validateEmail(user.getEmail())) {
            return nullptr;
        }
        
        std::lock_guard<std::mutex> lock(mutex_);
        auto newUser = std::make_shared<User>(user);
        newUser->setId(nextId_++);
        users_[newUser->getId()] = newUser;
        return newUser;
    }
    
    /**
     * 更新用户信息
     */
    std::shared_ptr<User> updateUser(long id, const User& user) {
        if (id <= 0) {
            return nullptr;
        }
        
        std::lock_guard<std::mutex> lock(mutex_);
        auto it = users_.find(id);
        if (it == users_.end()) {
            return nullptr;
        }
        
        auto updatedUser = std::make_shared<User>(user);
        updatedUser->setId(id);
        users_[id] = updatedUser;
        return updatedUser;
    }
    
    /**
     * 删除用户
     */
    bool deleteUser(long id) {
        if (id <= 0) {
            return false;
        }
        
        std::lock_guard<std::mutex> lock(mutex_);
        return users_.erase(id) > 0;
    }
    
    /**
     * 激活用户
     */
    bool activateUser(long id) {
        auto user = findUserById(id);
        if (!user) {
            return false;
        }
        
        user->setActive(true);
        return true;
    }
    
    /**
     * 停用用户
     */
    bool deactivateUser(long id) {
        auto user = findUserById(id);
        if (!user) {
            return false;
        }
        
        user->setActive(false);
        return true;
    }
    
    /**
     * 根据邮箱查找用户
     */
    std::shared_ptr<User> findUserByEmail(const std::string& email) {
        std::lock_guard<std::mutex> lock(mutex_);
        for (auto& pair : users_) {
            if (pair.second->getEmail() == email) {
                return pair.second;
            }
        }
        return nullptr;
    }
    
    /**
     * 根据用户名查找用户
     */
    std::shared_ptr<User> findUserByUsername(const std::string& username) {
        std::lock_guard<std::mutex> lock(mutex_);
        for (auto& pair : users_) {
            if (pair.second->getUsername() == username) {
                return pair.second;
            }
        }
        return nullptr;
    }
    
private:
    bool validateEmail(const std::string& email) {
        // 简单的邮箱验证
        size_t atPos = email.find('@');
        size_t dotPos = email.find_last_of('.');
        return atPos != std::string::npos && 
               dotPos != std::string::npos && 
               dotPos > atPos;
    }
    
    std::unordered_map<long, std::shared_ptr<User>> users_;
    std::mutex mutex_;
    long nextId_;
};

} // namespace testmind

#endif // USERMANAGER_H
