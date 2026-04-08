package com.course_management.project.repository;

import com.course_management.project.modal.RegistrationRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RequestRepository extends JpaRepository<RegistrationRequest, Integer> {
    List<RegistrationRequest> findByStudentId(Integer studentId);
    int countByStudentIdAndStatus(Integer studentId, String status);
    List<RegistrationRequest> findByStatus(String status);
}