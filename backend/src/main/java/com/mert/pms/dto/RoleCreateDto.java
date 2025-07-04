package com.mert.pms.dto;

import com.mert.pms.model.Permission;
import lombok.Data;

import java.util.Set;

@Data
public class RoleCreateDto {
    private String name;
    private Set<Permission> permissions;
}
