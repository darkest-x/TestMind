package com.testmind.repository;

import com.testmind.model.User;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * 用户仓库实现类
 */
public class UserRepositoryImpl implements UserRepository {

    private final Map<Long, User> users = new ConcurrentHashMap<>();
    private final AtomicLong nextId = new AtomicLong(1);

    @Override
    public Optional<User> findById(Long id) {
        if (id == null) {
            return Optional.empty();
        }
        return Optional.ofNullable(users.get(id));
    }

    @Override
    public List<User> findAll() {
        return new ArrayList<>(users.values());
    }

    @Override
    public User save(User user) {
        if (user == null) {
            throw new IllegalArgumentException("用户信息不能为空");
        }

        if (user.getId() == null) {
            user.setId(nextId.getAndIncrement());
        }

        users.put(user.getId(), user);
        return user;
    }

    @Override
    public void deleteById(Long id) {
        if (id != null) {
            users.remove(id);
        }
    }

    @Override
    public Optional<User> findByEmail(String email) {
        if (email == null) {
            return Optional.empty();
        }

        return users.values().stream()
                .filter(user -> email.equals(user.getEmail()))
                .findFirst();
    }

    @Override
    public Optional<User> findByUsername(String username) {
        if (username == null) {
            return Optional.empty();
        }

        return users.values().stream()
                .filter(user -> username.equals(user.getUsername()))
                .findFirst();
    }
}
