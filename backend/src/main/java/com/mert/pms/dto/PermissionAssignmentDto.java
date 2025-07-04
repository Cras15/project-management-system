package com.mert.pms.dto;

import lombok.Getter;

import java.util.Set;

@Getter
public class PermissionAssignmentDto {
    private Set<Long> permissionIds;
}
