package com.mert.pms.service;

import com.mert.pms.dto.AssignEmployeeDTO;
import com.mert.pms.dto.EmployeeDTO;
import com.mert.pms.model.Employee;
import com.mert.pms.model.Project;
import com.mert.pms.repository.EmployeeRepository;
import com.mert.pms.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private EmployeeRepository employeeRepository;

    public List<Project> findAll() {
        return projectRepository.findAll();
    }

    public Project findById(Long id) {
        return projectRepository.findById(id).get();
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
}
