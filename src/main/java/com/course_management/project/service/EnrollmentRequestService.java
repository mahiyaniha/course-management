package com.course_management.project.service;

import com.course_management.project.dto.EnrollmentRequestDTO;
import com.course_management.project.modal.CourseSection;
import com.course_management.project.modal.Enrollment;
import com.course_management.project.modal.EnrollmentRequest;
import com.course_management.project.modal.Student;
import com.course_management.project.repository.EnrollmentRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnrollmentRequestService {
    private final EnrollmentRequestRepository enrollmentRequestRepository;
    private final CourseSectionService courseSectionService;
    private final StudentService studentService;
    private final EnrollmentService enrollmentService;

    public EnrollmentRequestService(
            final CourseSectionService courseSectionService,
            final EnrollmentRequestRepository enrollmentRequestRepository, StudentService studentService, EnrollmentService enrollmentService) {
        this.enrollmentRequestRepository = enrollmentRequestRepository;
        this.courseSectionService = courseSectionService;
        this.studentService = studentService;
        this.enrollmentService = enrollmentService;
    }

    public List<EnrollmentRequest> getEnrollmentRequests(Integer userId) {
        return enrollmentRequestRepository.findByCourse_Advisor_User_Id(userId);
    }

    public EnrollmentRequest postEnrollmentRequestAction(EnrollmentRequestDTO dto) {
        CourseSection sectionById = courseSectionService.getCourseSectionById(dto.getSectionId());
        Student studentById = studentService.getStudentById(dto.getStudentId());

        if (sectionById.getSeatLimit() - sectionById.getSeatTaken() < 1) {
            throw new RuntimeException("Not enough seat available");
        }

        if (dto.getStatus().equalsIgnoreCase("APPROVED")) {
            Enrollment enrollment = new Enrollment();
            enrollment.setSection(sectionById);
            enrollment.setStudent(studentById);
            enrollmentService.saveEnrollment(enrollment);
        }

        EnrollmentRequest.Status status = EnrollmentRequest.Status.valueOf(dto.getStatus().toUpperCase());
        EnrollmentRequest er = enrollmentRequestRepository.findById(dto.getEnrollmentRequestId()).orElseThrow(() -> new RuntimeException("No enrollment request found associate with the ID"));
        er.setStatus(status);
        enrollmentRequestRepository.save(er);

        return er;
    }

}
