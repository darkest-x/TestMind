package com.testmind.service;

import com.testmind.model.User;
import com.testmind.repository.UserRepository;
import java.util.List;
import java.util.Optional;

/**
 * 用户服务类
 * 提供用户管理的核心功能
 */
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * 根据ID查找用户
     */
    public Optional<User> findUserById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("用户ID必须为正数");
        }
        return userRepository.findById(id);
    }

    /**
     * 获取所有用户
     */
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    /**
     * 创建新用户
     */
    public User createUser(User user) {
        if (user == null) {
            throw new IllegalArgumentException("用户信息不能为空");
        }
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("用户邮箱不能为空");
        }
        validateEmailFormat(user.getEmail());
        return userRepository.save(user);
    }

    /**
     * 更新用户信息
     */
    public User updateUser(Long id, User user) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("用户ID必须为正数");
        }
        Optional<User> existingUser = userRepository.findById(id);
        if (existingUser.isEmpty()) {
            throw new RuntimeException("用户不存在");
        }
        return userRepository.save(user);
    }

    /**
     * 删除用户
     */
    public void deleteUser(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("用户ID必须为正数");
        }
        userRepository.deleteById(id);
    }

    /**
     * 验证邮箱格式
     */
    private void validateEmailFormat(String email) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
        if (!email.matches(emailRegex)) {
            throw new IllegalArgumentException("邮箱格式不正确");
        }
    }
}
