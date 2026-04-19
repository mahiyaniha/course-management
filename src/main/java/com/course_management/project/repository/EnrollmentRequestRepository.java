package com.course_management.project.repository;

import com.course_management.project.modal.EnrollmentRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRequestRepository extends JpaRepository<EnrollmentRequest, Integer> {
    List<EnrollmentRequest> findByCourse_Advisor_User_Id(Integer advisorId);
    List<EnrollmentRequest> findByStudent_Id(Integer studentId);
    List<EnrollmentRequest> findByStudent_IdAndCourse_Id(Integer studentId, Integer courseId);
}