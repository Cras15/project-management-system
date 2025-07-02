package com.mert.pms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class AuthRequest {
    @NotEmpty(message = "Email boş olamaz.")
    @Email
    private String email;
    @NotEmpty(message = "Şifre boş olamaz.")
    private String password;
}
