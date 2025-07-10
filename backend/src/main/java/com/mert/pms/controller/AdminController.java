package com.mert.pms.controller;

import com.mert.pms.dto.PermissionAssignmentDto;
import com.mert.pms.dto.PermissionEditDTO;
import com.mert.pms.dto.RoleCreateDto;
import com.mert.pms.model.Permission;
import com.mert.pms.model.Role;
import com.mert.pms.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/role")
    @PreAuthorize("hasAuthority('ROLE_ADD') or hasRole('ADMIN')")
    public ResponseEntity<Role> createRole(@RequestBody RoleCreateDto roleCreateDto) {
        return ResponseEntity.ok(adminService.createRole(roleCreateDto));
    }

    @GetMapping("/role")
    @PreAuthorize("hasAuthority('ROLE_GET_LIST') or hasRole('ADMIN')")
    public ResponseEntity<?> getAllRoles(
            @RequestParam(required = false) String search,
            Pageable pageable) {
        return ResponseEntity.ok(adminService.findRoles(search, pageable));
    }

    @PutMapping("/role/{id}")
    @PreAuthorize("hasAuthority('ROLE_EDIT') or hasRole('ADMIN')")
    public ResponseEntity<?> updateRole(@PathVariable Long id, @RequestBody RoleCreateDto roleCreateDto) {
        return ResponseEntity.ok(adminService.updateRole(id, roleCreateDto));
    }

    @GetMapping("/role/{id}")
    @PreAuthorize("hasAuthority('ROLE_GET') or hasRole('ADMIN')")
    public ResponseEntity<Role> getRole(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.findRoleById(id));
    }

    @PutMapping("/{roleId}/permissions")
    @PreAuthorize("hasAuthority('ROLE_ASSIGN_PERM') or hasRole('ADMIN')")
    public ResponseEntity<Role> assignPermissionsToRole(
            @PathVariable Long roleId,
            @RequestBody PermissionAssignmentDto permissionDto) {
        Role updatedRole = adminService.assignPermissions(roleId, permissionDto.getPermissionIds());
        return ResponseEntity.ok(updatedRole);
    }

    @PostMapping("/role/delete/{id}")
    @PreAuthorize("hasAuthority('ROLE_DELETE') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteRole(@PathVariable Long id) {
        adminService.deleteRole(id);
        return ResponseEntity.ok("Rol silindi");
    }

    @GetMapping("/permissions")
    @PreAuthorize("hasAuthority('PERMISSION_GET_LIST') or hasRole('ADMIN')")
    public ResponseEntity<?> getAllPermissions(
            @RequestParam(required = false) String search,
            Pageable pageable) {
        return ResponseEntity.ok(adminService.findPermissions(search, pageable));
    }

    @GetMapping("/permission/{id}")
    @PreAuthorize("hasAuthority('PERMISSION_GET') or hasRole('ADMIN')")
    public ResponseEntity<?> getPermission(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.findPermissionById(id));
    }

    @PostMapping("/permission")
    @PreAuthorize("hasAuthority('PERMISSION_ADD') or hasRole('ADMIN')")
    public ResponseEntity<Permission> createPermission(@RequestBody PermissionEditDTO permissionDTO) {
        return ResponseEntity.ok(adminService.createPermission(permissionDTO.getName()));
    }

    @PutMapping("/permission/{id}")
    @PreAuthorize("hasAuthority('PERMISSION_EDIT') or hasRole('ADMIN')")
    public ResponseEntity<Permission> updatePermission(@PathVariable Long id, @RequestBody PermissionEditDTO permissionCreateDTO) {
        return ResponseEntity.ok(adminService.updatePermission(id,permissionCreateDTO));
    }

    @PostMapping("/permission/delete/{id}")
    @PreAuthorize("hasAuthority('PERMISSION_DELETE') or hasRole('ADMIN')")
    public ResponseEntity<?> deletePermission(@PathVariable Long id) {
        adminService.deletePermission(id);
        return ResponseEntity.ok("Yetki silindi");
    }
}
