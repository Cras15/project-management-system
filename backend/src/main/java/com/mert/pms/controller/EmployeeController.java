package com.mert.pms.controller;

import com.mert.pms.dto.EmployeeDTO;
import com.mert.pms.model.Employee;
import com.mert.pms.repository.EmployeeRepository;
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
    public ResponseEntity<?> addEmployee(@RequestBody EmployeeDTO employeeDTO) {
        Employee existingUser = employeeService.findByEmail(employeeDTO.getEmail());

        if (existingUser != null)
            return new ResponseEntity<>("Bu e-posta adresi zaten kullanılıyor!", HttpStatus.BAD_REQUEST);

        return ResponseEntity.ok(employeeService.addEmployee(employeeDTO));
    }

    @GetMapping("/get")
    @PreAuthorize("hasAuthority('PROJECT_MANAGER')")
    public List<Employee> getAllEmployees() {
        return employeeService.findAllUsers();
    }

    @GetMapping("/get/{id}")
    @PreAuthorize("hasAnyAuthority('PROJECT_MANAGER')")
    public Employee getEmployeeById(@PathVariable Long id) {
        return employeeService.getEmployeeById(id);
    }

    @PostMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('PROJECT_MANAGER')")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        System.out.println(id);
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok("Çalışan silindi");
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAuthority('PROJECT_MANAGER')")
    public ResponseEntity<?> updateEmployee(@PathVariable Long id, @RequestBody EmployeeDTO employee) {
        employeeService.updateEmployee(id,employee);
        return ResponseEntity.ok("Çalışan güncellendi");
    }

}
