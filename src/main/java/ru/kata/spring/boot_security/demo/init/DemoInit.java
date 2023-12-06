package ru.kata.spring.boot_security.demo.init;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.entity.Role;
import ru.kata.spring.boot_security.demo.entity.User;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;
import ru.kata.spring.boot_security.demo.repository.UserRepository;

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Component
public class DemoInit {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    Set<Role> defaultRoles;

    @Autowired
    public DemoInit(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @PostConstruct
    @Transactional
    public void postConstruct() {

        Role roleAdmin = new Role("ROLE_ADMIN");
        Role roleUser = new Role("ROLE_USER");

        roleRepository.save(roleAdmin);
        roleRepository.save(roleUser);

        User adminUser = new User("Ivan", "Ivanov", (byte) 27, "Ivan@mail.ru",
                passwordEncoder.encode("admin"), "admin");
        userRepository.save(adminUser);

        User normalUser = new User("Artem", "Shtraukh", (byte) 27, "Artme@mail.ru",
                passwordEncoder.encode("user"), "user");
        userRepository.save(normalUser);

        adminUser.setRoles(new HashSet<>(Arrays.asList(roleAdmin, roleUser)));
        normalUser.setRoles(new HashSet<>(Collections.singletonList(roleUser)));

        userRepository.save(adminUser);
        userRepository.save(normalUser);
    }

    @Bean
    public Set<Role> getDefaultRole() {
        if (defaultRoles == null || defaultRoles.isEmpty()) {
            defaultRoles = new HashSet<>(roleRepository.findAll());
        }
        return defaultRoles;
    }
}