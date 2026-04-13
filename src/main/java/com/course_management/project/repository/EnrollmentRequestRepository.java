package com.course_management.project.repository;

import com.course_management.project.modal.EnrollmentRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentRequestRepository extends JpaRepository<EnrollmentRequest, Integer> {
}