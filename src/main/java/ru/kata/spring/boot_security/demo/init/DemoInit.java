package ru.kata.spring.boot_security.demo.init;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.entity.Role;
import ru.kata.spring.boot_security.demo.entity.User;
import ru.kata.spring.boot_security.demo.service.RoleServiceImpl;
import ru.kata.spring.boot_security.demo.service.UserDetailsServiceImpl;

import javax.transaction.Transactional;
import java.util.HashSet;
import java.util.Set;

@Component
public class DemoInit {

    private final RoleServiceImpl roleService;
    private final UserDetailsServiceImpl userDetailsService;

    @Autowired
    public DemoInit(RoleServiceImpl roleService, UserDetailsServiceImpl userDetailsService) {
        this.roleService = roleService;
        this.userDetailsService = userDetailsService;
    }

    private final Role roleAdmin = new Role("ROLE_ADMIN");
    private final Role roleUser = new Role("ROLE_USER");

    public Set<Role> setAdminRole() {
        Set<Role> adminRole = new HashSet<>();
        adminRole.add(roleAdmin);
        return adminRole;
    }

    public Set<Role> setRoleUser() {
        Set<Role> userRole = new HashSet<>();
        userRole.add(roleUser);
        return userRole;
    }

    @Transactional
    @Bean
    public void addInitUsers() {
        roleService.save(roleAdmin);
        roleService.save(roleUser);

        User admin = new User("Ivan", "Ivanov", (byte) 26, "Ivan@gmail.com","admin"
                , "admin",
                setAdminRole()); // пароль: admin
        User user = new User("Atrem", "Shtraukh", (byte) 26, "Shtraukh@gmail.com",
                "user", "user",
                setRoleUser()); // пароль: user

        userDetailsService.saveUser(admin);
        userDetailsService.saveUser(user);
    }
}