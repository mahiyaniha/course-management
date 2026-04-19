package com.course_management.project.service;

import com.course_management.project.modal.Enrollment;
import com.course_management.project.repository.EnrollmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnrollmentService {
    final private EnrollmentRepository enrollmentRepository;

    public EnrollmentService(
            final EnrollmentRepository enrollmentRepository) {
        this.enrollmentRepository = enrollmentRepository;
    }
    public List<Enrollment> getEnrollments(Integer userId) {
        return enrollmentRepository.findBySection_Course_Advisor_User_Id(userId);
    }

    public void saveEnrollment(Enrollment enrollment) {
        enrollmentRepository.save(enrollment);
    }


}
