package com.course_management.project.repository;

import com.course_management.project.modal.Admin;
import com.course_management.project.modal.Advisor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Integer> {
    Optional<Admin> findByUniqueId(String uniqueId);
}
