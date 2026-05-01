package com.testmind.repository;

import com.testmind.model.User;
import java.util.List;
import java.util.Optional;

/**
 * 用户仓库接口
 */
public interface UserRepository {

    Optional<User> findById(Long id);

    List<User> findAll();

    User save(User user);

    void deleteById(Long id);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);
}
