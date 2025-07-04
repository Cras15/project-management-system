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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Collection;
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

    @PostMapping("/add")
    @PreAuthorize("hasAuthority('PROJECT_ADD') or hasRole('ADMIN')")
    public ResponseEntity<?> addProject(@RequestBody Project project) {
        projectService.saveProject(project);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/get")
    //@PreAuthorize("hasAuthority('PROJECT_GET') or hasRole('ADMIN')")
    public ResponseEntity<?> findAll(Principal principal) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Employee employee = employeeService.findByEmail(principal.getName());
        Set<Project> projects = projectService.findByEmployeeId(employee.getId());

        if (authorities.contains(new SimpleGrantedAuthority("PROJECT_GET")) ||
                authorities.contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            return ResponseEntity.ok(projectService.findAll());
        } else if (!projects.isEmpty()) {
            return ResponseEntity.ok(projects);
        } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }


    @GetMapping("/get/{id}")
    @PreAuthorize("hasAuthority('PROJECT_GET') or hasRole('ADMIN')")
    public ResponseEntity<?> findById(@PathVariable Long id, Principal principal) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Employee employee = employeeService.findByEmail(principal.getName());
        Project project = projectService.findById(id);

        /*if (project.getAssignedEmployees().contains(employee) &&
                authentication.getAuthorities().stream()
                        .noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN")))
            return new ResponseEntity<>("Bunu yapmaya yetkin yok!", HttpStatus.UNAUTHORIZED);*/
        return ResponseEntity.ok(project);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('PROJECT_DELETE') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        projectService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAuthority('PROJECT_EDIT') or hasRole('ADMIN')")
    public ResponseEntity<?> updateProject(@PathVariable Long id, @RequestBody Project project) {
        projectService.updateProject(id, project);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/assignEmployee")
    @PreAuthorize("hasAuthority('PROJECT_ASSIGN_EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<?> assignEmployeeToProject(@RequestBody AssignEmployeeDTO assignEmployeeDTO) {
        return ResponseEntity.ok().body(
                projectService.assignEmployee(assignEmployeeDTO));
    }

    @PostMapping("/deleteEmployee")
    @PreAuthorize("hasAuthority('PROJECT_ASSIGN_EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteEmployeeFromProject(@RequestBody AssignEmployeeDTO assignEmployeeDTO) {
        return ResponseEntity.ok(
                projectService.deleteAssignedEmployee(assignEmployeeDTO));
    }

    @GetMapping("/getAssignEmployees/{id}")
    @PreAuthorize("hasAuthority('PROJECT_ASSIGN_EMPLOYEE') or hasRole('ADMIN')")
    public Set<Employee> getAssignEmployees(@PathVariable Long id) {
        return projectService.getAssignEmployees(id);
    }
}