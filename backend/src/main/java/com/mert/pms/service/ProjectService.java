package com.mert.pms.service;

import com.mert.pms.dto.AssignEmployeeDTO;
import com.mert.pms.dto.EmployeeDTO;
import com.mert.pms.model.Employee;
import com.mert.pms.model.Project;
import com.mert.pms.repository.EmployeeRepository;
import com.mert.pms.repository.ProjectRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Set;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private EmployeeRepository employeeRepository;

    public Project findById(Long id) {
        return projectRepository.findById(id).get();
    }
    public Page<Project> findByEmployeeId(Pageable pageable, Long id) {
        return projectRepository.findProjectsByEmployeeId(pageable, id);
    }
    public void saveProject(Project project) {
        projectRepository.save(project);
    }

    public void updateProject(Long id, Project project) {
        Project oldProject = projectRepository.findById(id).get();
        oldProject.setProjectName(project.getProjectName());
        oldProject.setStatus(project.getStatus());
        projectRepository.save(oldProject);
    }

    public void deleteById(Long id) {
        projectRepository.deleteById(id);
    }

    @Transactional
    public String assignEmployee(AssignEmployeeDTO employeeDTO) {
        try {
            Employee employee = employeeRepository.findById(employeeDTO.getEmployeeId()).get();
            Project project = findById(employeeDTO.getProjectId());
            project.getAssignedEmployees().add(employee);
            projectRepository.save(project);
            return "success";
        } catch (Exception e) {
            return e.getMessage();
        }
    }

    @Transactional
    public String deleteAssignedEmployee(AssignEmployeeDTO employeeDTO) {
        try {
            Project project = findById(employeeDTO.getProjectId());
            Employee employee = employeeRepository.findById(employeeDTO.getEmployeeId()).get();
            project.getAssignedEmployees().remove(employee);
            projectRepository.save(project);
            return "success";
        } catch (Exception e) {
            return e.getMessage();
        }
    }

    public Set<Employee> getAssignEmployees(Long projectId) {
        Project project = findById(projectId);
        return project.getAssignedEmployees();
    }

    public Page<Project> findProducts(String keyword, Pageable pageable) {
        if (StringUtils.hasText(keyword)) {
            return projectRepository.findByProjectNameContainingIgnoreCase(keyword, pageable);
        } else {
            return projectRepository.findAll(pageable);
        }
    }
}
