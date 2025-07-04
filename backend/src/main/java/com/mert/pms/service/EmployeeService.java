package com.mert.pms.service;

import com.mert.pms.dto.EmployeeDTO;
import com.mert.pms.model.Employee;
import com.mert.pms.model.Role;
import com.mert.pms.repository.EmployeeRepository;
import com.mert.pms.repository.RoleRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeService(EmployeeRepository employeeRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Employee getEmployeeById(Long employeeId) {
        return employeeRepository.findById(employeeId).get();
    }
    public Employee findByEmail(String email) {
        return employeeRepository.findByEmail(email);
    }

    @Transactional
    public void updateEmployee(Employee oldEmployee, EmployeeDTO employeeDTO) {
        oldEmployee.setFirstName(employeeDTO.getFirstName());
        oldEmployee.setLastName(employeeDTO.getLastName());
        oldEmployee.setEmail(employeeDTO.getEmail());
        oldEmployee.setRoles(employeeDTO.getRoles());
        employeeRepository.save(oldEmployee);
    }
    public void deleteEmployee(Long id) {
        Employee employee = getEmployeeById(id);
        employeeRepository.delete(employee);
    }

    @Transactional
    public Employee addEmployee(EmployeeDTO employeeDTO) {
        Employee employee = new Employee();
        Role role = roleRepository.findByName("ROLE_EMPLOYEE").get();
        Set<Role> roles = new HashSet<>();
        roles.add(role);

        employee.setFirstName(employeeDTO.getFirstName());
        employee.setLastName(employeeDTO.getLastName());
        employee.setEmail(employeeDTO.getEmail());
        employee.setPassword(passwordEncoder.encode(employeeDTO.getPassword()));
        employee.setCreateTime(LocalDateTime.now());
        employee.setUpdateTime(LocalDateTime.now());
        employee.setRoles(roles);

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
