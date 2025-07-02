package com.mert.pms.dto;

import com.mert.pms.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;
}
