package com.crudonspringboot.service;


import com.crudonspringboot.repository.RoleRepository;
import com.crudonspringboot.models.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RoleServiceImpl implements RoleService{

    private final RoleRepository roleRepository;

    @Autowired
    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void save(Role role) {
        roleRepository.save(role);
    }

    @Override
    public Set<Role> getAllRoles() {
        return new HashSet<>(roleRepository.findAll());
    }

    @Override
    public Role getRoleById(Long id) {
        Role role = null;
        Optional <Role> optional = roleRepository.findById(id);
        if (optional.isPresent()) {
            role = optional.get();
        }
        return role;
    }
}
