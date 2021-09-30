package com.crudonspringboot.controllers;

import com.crudonspringboot.service.RoleService;
import com.crudonspringboot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@Controller
public class MyController {
    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public MyController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("/admin")
    public String index(Model model, Principal principal){
        model.addAttribute("currentUser", userService.loadUserByUsername(principal.getName()));
        model.addAttribute("AllRoles", roleService.getAllRoles());
        return "admin/index";
    }

    @GetMapping("/user")
    public String getUserPage(Principal principal, Model model) {
        model.addAttribute("currentUser",userService.loadUserByUsername(principal.getName()));
        return "/user/userPage";
    }
}