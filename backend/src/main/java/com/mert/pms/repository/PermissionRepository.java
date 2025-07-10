package com.mert.pms.repository;

import com.mert.pms.model.Permission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
    Optional<Permission> findByName(String name);
    Page<Permission> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
