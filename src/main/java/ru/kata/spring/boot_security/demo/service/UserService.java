package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.entity.User;

import java.util.List;

public interface UserService {

    User findByName(String username);

    List<User> findAll();

    User findOne(Long id);

    void saveUser(User user);

    void update(User updateUser);

    void deleteUser(long id);
}
