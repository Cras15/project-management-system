package com.mert.pms.repository;

import com.mert.pms.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Project findByProjectName(String projectName);
}
