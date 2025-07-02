package com.mert.pms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class EmployeeDTO {
    @NotEmpty(message = "İsim boş olamaz.")
    private String firstName;

    @NotEmpty(message = "Soyisim boş olamaz.")
    private String lastName;

    @NotEmpty(message = "Email boş olamaz.")
    @Email
    private String email;

    @NotEmpty(message = "Şifre boş olamaz.")
    private String password;
}
