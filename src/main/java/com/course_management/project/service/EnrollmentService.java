package com.course_management.project.service;

import com.course_management.project.modal.Enrollment;
import com.course_management.project.modal.User;
import com.course_management.project.repository.EnrollmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnrollmentService {
    final private EnrollmentRepository enrollmentRepository;
    final private UserService userService;

    public EnrollmentService(
            final EnrollmentRepository enrollmentRepository, UserService userService) {
        this.enrollmentRepository = enrollmentRepository;
        this.userService = userService;
    }
    public List<Enrollment> getEnrollments(Integer userId) {
        User userById = userService.getUserById(userId);

        if (userById.getRole().name().equalsIgnoreCase("student")) {
            return enrollmentRepository.findByStudent_User_Id(userId);
        } else {
            return enrollmentRepository.findBySection_Course_Advisor_User_Id(userId);
        }
    }

    public void saveEnrollment(Enrollment enrollment) {
        enrollmentRepository.save(enrollment);
    }


}
