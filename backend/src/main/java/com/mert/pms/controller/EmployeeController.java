package com.mert.pms.controller;

import com.mert.pms.dto.EmployeeDTO;
import com.mert.pms.model.Employee;
import com.mert.pms.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employee")
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;

    @PostMapping("/add")
    @PreAuthorize("hasAuthority('EMPLOYEE_ADD') or hasRole('ADMIN')")
    public ResponseEntity<?> addEmployee(@RequestBody EmployeeDTO employeeDTO) {
        Employee existingUser = employeeService.findByEmail(employeeDTO.getEmail());

        if (existingUser != null)
            return new ResponseEntity<>("Bu e-posta adresi zaten kullanılıyor!", HttpStatus.BAD_REQUEST);

        return ResponseEntity.ok(employeeService.addEmployee(employeeDTO));
    }

    @GetMapping("/get")
    @PreAuthorize("hasAuthority('EMPLOYEE_GET') or hasRole('ADMIN')")
    public List<Employee> getAllEmployees() {
        return employeeService.findAllUsers();
    }

    @GetMapping("/get/{id}")
    @PreAuthorize("hasAuthority('EMPLOYEE_GET') or hasRole('ADMIN')")
    public Employee getEmployeeById(@PathVariable Long id) {
        return employeeService.getEmployeeById(id);
    }

    @PostMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('EMPLOYEE_DELETE') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok("Çalışan silindi");
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAuthority('EMPLOYEE_UPDATE') or hasRole('ADMIN')")
    public ResponseEntity<?> updateEmployee(@PathVariable Long id, @RequestBody EmployeeDTO employeeDTO) {
        Employee existingUser = employeeService.findByEmail(employeeDTO.getEmail());
        Employee oldEmployee = employeeService.getEmployeeById(id);

        if (existingUser != null && !oldEmployee.getEmail().equals(employeeDTO.getEmail()))
            return new ResponseEntity<>("Bu e-posta adresi zaten kullanılıyor!", HttpStatus.BAD_REQUEST);

        employeeService.updateEmployee(oldEmployee,employeeDTO);
        return ResponseEntity.ok("Çalışan güncellendi");
    }

}
