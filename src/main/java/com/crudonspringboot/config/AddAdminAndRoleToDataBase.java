package com.crudonspringboot.config;

import com.crudonspringboot.models.Role;
import com.crudonspringboot.models.User;
import com.crudonspringboot.service.RoleService;
import com.crudonspringboot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import javax.annotation.PostConstruct;
import java.util.HashSet;
import java.util.Set;

@Component
public class AddAdminAndRoleToDataBase {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public AddAdminAndRoleToDataBase(UserService userService, RoleService roleService){
        this.userService = userService;
        this.roleService = roleService;
    }

    @PostConstruct
    public void doInit(){
        // create roles
        Role roleAdmin = new Role("ROLE_ADMIN");
        Role roleUser = new Role("ROLE_USER");
        roleService.save(roleAdmin);
        roleService.save(roleUser);
        // create Set for Users
        Set<Role> usersSet = new HashSet<>();
        usersSet.add(roleUser);
        // create Admin
        User admin = new User("Vasyu", "Adminov", (byte)20, "Admin", "Admin", new HashSet<>(roleService.getAllRoles()));
        // create Users

        userService.add(admin);

    }
}