package com.mert.pms.controller;

import com.mert.pms.dto.AssignEmployeeDTO;
import com.mert.pms.model.Employee;
import com.mert.pms.model.Project;
import com.mert.pms.model.Role;
import com.mert.pms.repository.ProjectRepository;
import com.mert.pms.service.EmployeeService;
import com.mert.pms.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/project")
public class ProjectController {

    private final ProjectService projectService;
    private final EmployeeService employeeService;

    public ProjectController(ProjectService projectService, EmployeeService employeeService) {
        this.projectService = projectService;
        this.employeeService = employeeService;
    }

    @PreAuthorize("hasAuthority('PROJECT_MANAGER')")
    @PostMapping("/add")
    public ResponseEntity<?> addProject(@RequestBody Project project) {
        projectService.saveProject(project);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAuthority('PROJECT_MANAGER')")
    @GetMapping("/get")
    public Iterable<Project> findAll() {
        return projectService.findAll();
    }


    @GetMapping("/get/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id, Principal principal) {
        Employee employee = employeeService.findByEmail(principal.getName());
        Project project = projectService.findById(id);
        if (employee.getRole() == Role.EMPLOYEE && project.getAssignedEmployees().contains(employee))
            return new ResponseEntity<>("Bunu yapmaya yetkin yok!", HttpStatus.UNAUTHORIZED);
        return ResponseEntity.ok(project);
    }

    @PreAuthorize("hasAuthority('PROJECT_MANAGER')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        projectService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAuthority('PROJECT_MANAGER')")
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateProject(@PathVariable Long id, @RequestBody Project project) {
        projectService.updateProject(id, project);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/assignEmployee")
    @PreAuthorize("hasAuthority('PROJECT_MANAGER')")
    public ResponseEntity<?> assignEmployeeToProject(@RequestBody AssignEmployeeDTO assignEmployeeDTO) {
        return ResponseEntity.ok().body(
                projectService.assignEmployee(assignEmployeeDTO));
    }

    @PostMapping("/deleteEmployee")
    @PreAuthorize("hasAuthority('PROJECT_MANAGER')")
    public ResponseEntity<?> deleteEmployeeFromProject(@RequestBody AssignEmployeeDTO assignEmployeeDTO) {
        return ResponseEntity.ok(
                projectService.deleteAssignedEmployee(assignEmployeeDTO));
    }

    @GetMapping("/getAssignEmployees/{id}")
    @PreAuthorize("hasAuthority('PROJECT_MANAGER')")
    public Set<Employee> getAssignEmployees(@PathVariable Long id) {
        return projectService.getAssignEmployees(id);
    }
}