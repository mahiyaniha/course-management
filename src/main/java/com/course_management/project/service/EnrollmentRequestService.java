package com.course_management.project.service;

import com.course_management.project.dto.EnrollmentRequestDTO;
import com.course_management.project.modal.*;
import com.course_management.project.repository.EnrollmentRequestRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class EnrollmentRequestService {
    private final UserService userService;
    private final CourseService courseService;
    private final EnrollmentRequestRepository enrollmentRequestRepository;
    private final CourseSectionService courseSectionService;
    private final StudentService studentService;
    private final EnrollmentService enrollmentService;

    public EnrollmentRequestService(
            UserService userService, CourseService courseService, final CourseSectionService courseSectionService,
            final EnrollmentRequestRepository enrollmentRequestRepository, StudentService studentService, EnrollmentService enrollmentService) {
        this.userService = userService;
        this.courseService = courseService;
        this.enrollmentRequestRepository = enrollmentRequestRepository;
        this.courseSectionService = courseSectionService;
        this.studentService = studentService;
        this.enrollmentService = enrollmentService;
    }

    public List<EnrollmentRequest> getEnrollmentRequests(Integer userId) {
        User userById = userService.getUserById(userId);

        if (userById.getRole().name().equalsIgnoreCase("student")) {
            return enrollmentRequestRepository.findByStudent_User_Id(userId);
        } else {
            return enrollmentRequestRepository.findByCourse_Advisor_User_Id(userId);
        }
    }

    public EnrollmentRequest postEnrollmentRequestAction(EnrollmentRequestDTO dto) {
        // Check where it is coming from advisor or student
        // if userId present it is coming from student
        // if studentId present it is coming from advisor
        Student student = null;
        if (dto.getUserId() != null) {  // true means student submitted the request
            student = studentService.getStudentByUserId(dto.getUserId());
        } else {
            student = studentService.getStudentById(dto.getStudentId());
        }

        Course course = courseService.getCourseById(dto.getCourseId());
        if (Objects.equals(course.getAvailableSeat(), course.getTotalSeat())) {
            throw new RuntimeException("Can't enroll in this course. Not enough seat available");
        }


        int remainingStudentCredit = student.getDepartment().getCredits() - student.getCreditCompleted();
        if (remainingStudentCredit < course.getCredit()) {
            throw new RuntimeException("Course credit is greater then Student remaining credit.");
        }


        if (dto.getSectionId() != null) { // true means student submitted the request

            CourseSection section = courseSectionService.getCourseSectionById(dto.getSectionId());
            if (section.getSeatLimit() - section.getSeatTaken() < 1) {
                throw new RuntimeException("Not enough seat available");
            }

            if (dto.getStatus().equalsIgnoreCase("APPROVED")) {
                Enrollment enrollment = new Enrollment();
                enrollment.setSection(section);
                enrollment.setStudent(student);
                enrollment.setStatus(Enrollment.Status.ACTIVE);
                enrollmentService.saveEnrollment(enrollment);

                int futureTaken = section.getSeatTaken() + 1;
                section.setSeatTaken(futureTaken);
                courseSectionService.saveCourseSection(section);
            }
        }

        EnrollmentRequest er = null;

        List<EnrollmentRequest> erList = enrollmentRequestRepository.findByStudent_IdAndCourse_Id(student.getId(), dto.getCourseId());
        if (erList.isEmpty()) {
            er = new EnrollmentRequest();
        } else {
            er = erList.getFirst();
        }

        EnrollmentRequest.Status status = EnrollmentRequest.Status.valueOf(dto.getStatus().toUpperCase());
        er.setStatus(status);
        er.setCourse(course);
        er.setStudent(student);
        enrollmentRequestRepository.save(er);

        return er;
    }


    public Map<String, Integer> getEnrollmentRequestsStatus(Integer userId) {
        List<EnrollmentRequest> enrollmentRequests = getEnrollmentRequests(userId);
        int totalApprovedRequests = enrollmentRequests.stream()
                .filter(e -> e.getStatus() == EnrollmentRequest.Status.APPROVED).toList().size();

        int totalPendingRequests = enrollmentRequests.stream()
                .filter(e -> e.getStatus() == EnrollmentRequest.Status.PENDING).toList().size();

        int totalRejectedRequests = enrollmentRequests.stream()
                .filter(e -> e.getStatus() == EnrollmentRequest.Status.REJECTED).toList().size();


        Map<String, Integer> statusMap = new HashMap<>();
        statusMap.put("totalApprovedRequests", totalApprovedRequests);
        statusMap.put("totalPendingRequests", totalPendingRequests);
        statusMap.put("totalRejectedRequests", totalRejectedRequests);
        statusMap.put("totalRequests", totalApprovedRequests + totalPendingRequests + totalRejectedRequests);

        return statusMap;
    }

}
