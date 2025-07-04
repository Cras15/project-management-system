package com.mert.pms.service;

import com.mert.pms.dto.PermissionEditDTO;
import com.mert.pms.dto.RoleCreateDto;
import com.mert.pms.model.Permission;
import com.mert.pms.model.Role;
import com.mert.pms.repository.PermissionRepository;
import com.mert.pms.repository.RoleRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AdminService {
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    public AdminService(RoleRepository roleRepository, PermissionRepository permissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }

    @Transactional
    public Role createRole(RoleCreateDto roleCreateDto) {
        if (!roleCreateDto.getName().startsWith("ROLE_")) {
            roleCreateDto.setName("ROLE_" + roleCreateDto.getName().toUpperCase());
        }
        if (roleRepository.findByName(roleCreateDto.getName()).isPresent()) {
            throw new IllegalStateException("Role zaten mevcut");
        }
        Role role = new Role();
        role.setName(roleCreateDto.getName());
        role.setPermissions(roleCreateDto.getPermissions());
        return roleRepository.save(role);
    }

    @Transactional
    public Role updateRole(Long id, RoleCreateDto roleCreateDto) {
        Role role = roleRepository.findById(id).get();
        Optional<Role> existsRole=roleRepository.findByName(roleCreateDto.getName());

        if (existsRole.isPresent() && !existsRole.get().getId().equals(id))
            throw new IllegalStateException("Role zaten mevcut");

        role.setName(roleCreateDto.getName());
        role.setPermissions(roleCreateDto.getPermissions());
        return roleRepository.save(role);
    }

    @Transactional
    public Permission createPermission(String permissionName) {
        if (permissionRepository.findByName(permissionName).isPresent()) {
            throw new IllegalStateException("Yetki zaten mevcut");
        }
        Permission permission = new Permission();
        permission.setName(permissionName);
        return permissionRepository.save(permission);
    }

    @Transactional
    public Role assignPermissions(Long roleId, Set<Long> permissionIds) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role bulunamadı"));

        Set<Permission> permissions = permissionIds.stream()
                .map(id -> permissionRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Böyle bir yetki bulunamadı")))
                .collect(Collectors.toSet());

        role.setPermissions(permissions);
        return roleRepository.save(role);
    }

    public List<Role> findAllRoles() {
        return roleRepository.findAll();
    }

    public Role findRoleById(Long roleId) {
        return roleRepository.findById(roleId).get();
    }

    public Permission findPermissionById(Long permissionId) {
        return permissionRepository.findById(permissionId).get();
    }

    public List<Permission> findAllPermissions() {
        return permissionRepository.findAll();
    }

    @Transactional
    public Permission updatePermission(Long id, PermissionEditDTO permissionEditDTO) {
        Permission permission = permissionRepository.findById(id).get();
        permission.setName(permissionEditDTO.getName());
        return permissionRepository.save(permission);
    }

    public void deletePermission(Long id){
        permissionRepository.deleteById(id);
    }

    public void deleteRole(Long id){
        roleRepository.deleteById(id);
    }

}
