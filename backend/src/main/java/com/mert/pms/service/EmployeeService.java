package com.mert.pms.service;

import com.mert.pms.dto.EmployeeDTO;
import com.mert.pms.model.Employee;
import com.mert.pms.model.Role;
import com.mert.pms.repository.EmployeeRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeService(EmployeeRepository employeeRepository, PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
    }
    public Employee getEmployeeById(Long employeeId) {
        return employeeRepository.findById(employeeId).get();
    }
    public Employee findByEmail(String email) {
        return employeeRepository.findByEmail(email);
    }
    public void updateEmployee(Employee oldEmployee, EmployeeDTO employeeDTO) {
        oldEmployee.setFirstName(employeeDTO.getFirstName());
        oldEmployee.setLastName(employeeDTO.getLastName());
        oldEmployee.setEmail(employeeDTO.getEmail());
        employeeRepository.save(oldEmployee);
    }
    public void deleteEmployee(Long id) {
        Employee employee = getEmployeeById(id);
        employeeRepository.delete(employee);
    }
    public Employee addEmployee(EmployeeDTO employeeDTO) {
        Employee employee = new Employee();

        employee.setFirstName(employeeDTO.getFirstName());
        employee.setLastName(employeeDTO.getLastName());
        employee.setEmail(employeeDTO.getEmail());
        employee.setPassword(passwordEncoder.encode(employeeDTO.getPassword()));
        employee.setCreateTime(LocalDateTime.now());
        employee.setUpdateTime(LocalDateTime.now());
        employee.setRole(Role.EMPLOYEE);

        return  employeeRepository.save(employee);
    }

    public List<Employee> findAllUsers() {
        return employeeRepository.findAll();
    }
    public Employee loginEmployee(String email)
    {
        Employee employee = employeeRepository.findByEmail(email);
        employee.setLastLoginTime(LocalDateTime.now());
        employeeRepository.save(employee);
        return employee;
    }
}
