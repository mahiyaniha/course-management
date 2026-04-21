package com.course_management.project.api;

import com.course_management.project.dto.*;
import com.course_management.project.modal.*;
import com.course_management.project.service.EnrollmentRequestService;
import com.course_management.project.service.EnrollmentService;
import com.course_management.project.service.StudentService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/student")
public class StudentController {

    private final StudentService studentService;
    private final EnrollmentRequestService enrollmentRequestService;
    private final EnrollmentService enrollmentService;

    public StudentController(StudentService studentService, EnrollmentRequestService enrollmentRequestService, EnrollmentService enrollmentService) {
        this.studentService = studentService;
        this.enrollmentRequestService = enrollmentRequestService;
        this.enrollmentService = enrollmentService;
    }

    @GetMapping("/all")
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    @GetMapping("/{userId}")
    public Student getStudentById(@PathVariable Integer userId) {
        return studentService.getStudentByUserId(userId);
    }

    @GetMapping("/credits/{userId}")
    public Map<String, Integer> getStudentCreditsById(@PathVariable Integer userId) {
        return studentService.getStudentCredits(userId);
    }

    @PostMapping(value = "/update-profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProfile(
            @RequestPart("data") StudentDTO dto,
            @RequestPart(value = "photo", required = false) MultipartFile photo
    ) {
        try {
            String api_resp = studentService.updateStudentProfile(dto, photo);
            return ResponseEntity.ok("Profile updated successfully");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating profile");
        }
    }

        // 📊 DASHBOARD
    @GetMapping("/dashboard/{userId}")
    public DashboardDTO dashboard(@PathVariable Integer userId) {
        return studentService.getDashboard(userId);
    }

    @GetMapping("/enrollments/{userId}")
    public List<Enrollment> getEnrollments(@PathVariable Integer userId) {
        return enrollmentService.getEnrollments(userId);
    }

    @GetMapping("/completed_courses/{userId}")
    public List<MyCourseDTO> completedCourses(@PathVariable Integer userId) {
        return studentService.getCompletedCourses(userId);
    }

    @GetMapping("/schedule/{userId}")
    public List<CourseSection> schedule(@PathVariable Integer userId) {
        return studentService.getSchedule(userId);
    }

    @GetMapping("/enrollment-requests/{studentId}")
    public List<EnrollmentRequest> enrollmentRequests(@PathVariable Integer studentId) {
        return enrollmentRequestService.getEnrollmentRequests(studentId);
    }
    @PostMapping("/enrollment-requests/action")
    public ResponseEntity<EnrollmentRequest> postEnrollmentRequest(@RequestBody EnrollmentRequestDTO dto) {
        EnrollmentRequest resp = enrollmentRequestService.postEnrollmentRequestAction(dto);
        return ResponseEntity.ok(resp);
    }



    @GetMapping("/grades/distribution/{userId}")
    public GradeDistributionDTO gradeDistribution(@PathVariable Integer userId) {
        return studentService.getGradeDistribution(userId);
    }

    @GetMapping("/courses/{userId}")
    public List<CourseDTO> getAvailableCoursesFor(@PathVariable Integer userId) {
        return studentService.getAvailableCourses(userId);
    }


    @GetMapping("/analytics/{userId}")
    public StudentAnalyticsDTO getStudentAnalytics(@PathVariable Integer userId) {
        StudentAnalyticsDTO studentAnalytics = studentService.getStudentAnalytics(userId);
        Map<String, Integer> map = enrollmentRequestService.getEnrollmentRequestsStatus(userId);

        studentAnalytics.setTotalApprovedRequests(map.get("totalApprovedRequests"));
        studentAnalytics.setTotalPendingRequests(map.get("totalPendingRequests"));
        studentAnalytics.setTotalRejectedRequests(map.get("totalRejectedRequests"));
        studentAnalytics.setTotalRequests(map.get("totalRequests"));

        return studentAnalytics;
    }
}