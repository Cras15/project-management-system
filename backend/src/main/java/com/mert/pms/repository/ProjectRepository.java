package com.mert.pms.repository;

import com.mert.pms.model.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Project findByProjectName(String projectName);
    @Query("SELECT p FROM Project p JOIN p.assignedEmployees e WHERE e.id = :employeeId")
    Page<Project> findProjectsByEmployeeId(Pageable pageable, @Param("employeeId") Long employeeId);
    Page<Project> findByProjectNameContainingIgnoreCase(String projectName, Pageable pageable);
}
