package com.course_management.project.repository;

import com.course_management.project.modal.Advisor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdvisorRepository extends JpaRepository<Advisor, AdvisorRepository> {
}
