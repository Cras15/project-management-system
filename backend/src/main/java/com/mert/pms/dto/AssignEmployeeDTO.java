package com.mert.pms.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class AssignEmployeeDTO {
    @NotEmpty(message = "Çalışanı girmek zorundasın")
    private Long employeeId;
    @NotEmpty(message = "Geçersiz bir proje seçtiniz")
    private Long projectId;
}
