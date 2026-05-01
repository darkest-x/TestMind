#include "UserManager.h"

namespace testmind {

// 用户管理器的实现文件
// 提供额外的用户管理功能

/**
 * 批量创建用户
 */
std::vector<std::shared_ptr<User>> UserManager::createUsersBatch(
    const std::vector<User>& users) {
    
    std::vector<std::shared_ptr<User>> createdUsers;
    createdUsers.reserve(users.size());
    
    for (const auto& user : users) {
        auto createdUser = createUser(user);
        if (createdUser) {
            createdUsers.push_back(createdUser);
        }
    }
    
    return createdUsers;
}

/**
 * 批量删除用户
 */
int UserManager::deleteUsersBatch(const std::vector<long>& ids) {
    int deletedCount = 0;
    
    for (long id : ids) {
        if (deleteUser(id)) {
            deletedCount++;
        }
    }
    
    return deletedCount;
}

/**
 * 搜索用户（支持多种条件）
 */
std::vector<std::shared_ptr<User>> UserManager::searchUsers(
    const std::string& keyword,
    bool searchUsername,
    bool searchEmail,
    bool searchName) {
    
    std::vector<std::shared_ptr<User>> results;
    std::string lowerKeyword = toLowerCase(keyword);
    
    std::lock_guard<std::mutex> lock(mutex_);
    
    for (auto& pair : users_) {
        bool match = false;
        
        if (searchUsername) {
            std::string lowerUsername = toLowerCase(pair.second->getUsername());
            if (lowerUsername.find(lowerKeyword) != std::string::npos) {
                match = true;
            }
        }
        
        if (!match && searchEmail) {
            std::string lowerEmail = toLowerCase(pair.second->getEmail());
            if (lowerEmail.find(lowerKeyword) != std::string::npos) {
                match = true;
            }
        }
        
        if (!match && searchName) {
            std::string lowerFirstName = toLowerCase(pair.second->getFirstName());
            std::string lowerLastName = toLowerCase(pair.second->getLastName());
            if (lowerFirstName.find(lowerKeyword) != std::string::npos ||
                lowerLastName.find(lowerKeyword) != std::string::npos) {
                match = true;
            }
        }
        
        if (match) {
            results.push_back(pair.second);
        }
    }
    
    return results;
}

/**
 * 获取活跃用户数量
 */
int UserManager::getActiveUserCount() {
    std::lock_guard<std::mutex> lock(mutex_);
    int count = 0;
    
    for (auto& pair : users_) {
        if (pair.second->isActive()) {
            count++;
        }
    }
    
    return count;
}

/**
 * 获取用户总数
 */
int UserManager::getTotalUserCount() {
    std::lock_guard<std::mutex> lock(mutex_);
    return static_cast<int>(users_.size());
}

/**
 * 字符串转小写辅助函数
 */
std::string UserManager::toLowerCase(const std::string& str) {
    std::string result = str;
    for (char& c : result) {
        c = tolower(c);
    }
    return result;
}

/**
 * 用户信息验证
 */
bool UserManager::validateUser(const User& user) {
    if (user.getUsername().empty()) {
        return false;
    }
    
    if (user.getEmail().empty() || !validateEmail(user.getEmail())) {
        return false;
    }
    
    if (user.getPassword().empty()) {
        return false;
    }
    
    return true;
}

/**
 * 用户信息验证（详细）
 */
UserValidationResult UserManager::validateUserDetailed(const User& user) {
    UserValidationResult result;
    result.isValid = true;
    
    if (user.getUsername().empty()) {
        result.isValid = false;
        result.errors.push_back("用户名不能为空");
    } else if (user.getUsername().length() < 3) {
        result.isValid = false;
        result.errors.push_back("用户名至少需要3个字符");
    }
    
    if (user.getEmail().empty()) {
        result.isValid = false;
        result.errors.push_back("邮箱不能为空");
    } else if (!validateEmail(user.getEmail())) {
        result.isValid = false;
        result.errors.push_back("邮箱格式不正确");
    }
    
    if (user.getPassword().empty()) {
        result.isValid = false;
        result.errors.push_back("密码不能为空");
    } else if (user.getPassword().length() < 6) {
        result.isValid = false;
        result.errors.push_back("密码至少需要6个字符");
    }
    
    return result;
}

} // namespace testmind
