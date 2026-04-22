package com.course_management.project.api;

import com.course_management.project.dto.AdvisorDTO;
import com.course_management.project.dto.CourseDTO;
import com.course_management.project.dto.EnrollmentRequestDTO;
import com.course_management.project.modal.*;
import com.course_management.project.service.AdvisorService;
import com.course_management.project.service.CourseService;
import com.course_management.project.service.EnrollmentRequestService;
import com.course_management.project.service.EnrollmentService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/advisor")
public class AdvisorController {
    private final EnrollmentService enrollmentService;
    private final EnrollmentRequestService enrollmentRequestService;
    private final  AdvisorService advisorService;
    private final CourseService courseService;

    public AdvisorController(EnrollmentService enrollmentService, EnrollmentRequestService enrollmentRequestService, AdvisorService advisorService, CourseService courseService) {
        this.enrollmentService = enrollmentService;
        this.enrollmentRequestService = enrollmentRequestService;
        this.advisorService = advisorService;
        this.courseService = courseService;
    }

    @GetMapping("/all")
    public List<Advisor> getAllAdvisors() {
        return advisorService.getAllAdvisors();
    }

    @GetMapping("/{userId}")
    public Advisor getAdvisorById(@PathVariable Integer userId) {
        return advisorService.getAdvisorDetails(userId);
    }

    @PostMapping(value = "/update-profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProfile(
            @RequestPart("data") AdvisorDTO dto,
            @RequestPart(value = "photo", required = false) MultipartFile photo
    ) {
        try {
            String api_resp = advisorService.updateAdvisorProfile(dto, photo);
            return ResponseEntity.ok("Advisor Profile updated successfully");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating profile");
        }
    }

    // -------------------------
    // Enrollments
    // -------------------------
    @GetMapping("/enrollments/{userId}")
    public List<Enrollment> getEnrollments(@PathVariable Integer userId) {
        return enrollmentService.getEnrollments(userId);
    }

    // -------------------------
    // Enrollments Requests
    // -------------------------
    @GetMapping("/enrollment-requests/{userId}")
    public List<EnrollmentRequest> getEnrollmentRequests(@PathVariable Integer userId) {
        return enrollmentRequestService.getEnrollmentRequests(userId);
    }
    @PostMapping("/enrollment-requests/action")
    public EnrollmentRequest postEnrollmentRequestAction(@RequestBody EnrollmentRequestDTO enrollmentRequestDTO) {
        return enrollmentRequestService.postEnrollmentRequestAction(enrollmentRequestDTO);
    }

    @PutMapping("/status/{userId}")
    public Advisor postEnrollmentRequestAction(@PathVariable Integer userId, @RequestBody String status) {
        return advisorService.updateStatus(userId, status);
    }

}