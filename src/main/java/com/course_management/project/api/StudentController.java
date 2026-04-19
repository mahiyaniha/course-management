package com.course_management.project.api;

import com.course_management.project.dto.*;
import com.course_management.project.modal.*;
import com.course_management.project.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping("/all")
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    @GetMapping("/{userId}")
    public Student getStudentById(@PathVariable Integer userId) {
        return studentService.getStudentById(userId);
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

    @GetMapping("/courses")
    public List<CourseSection> courses() {
        return studentService.getAvailableCourses();
    }

    @PostMapping("/add_request")
    public ResponseEntity<?> add(@RequestBody EnrollmentRequestDTO dto) {
        String resp = studentService.addCourse(dto);
        Map<String, String> respMap = new HashMap<>();
        respMap.put("message", resp);
        return ResponseEntity.ok(respMap);
    }

    @GetMapping("/my_courses/{userId}")
    public List<MyCourseDTO> myCourses(@PathVariable Integer userId) {
        return studentService.myCourses(userId);
    }

    @GetMapping("/enrollments/{userId}")
    public List<Enrollment> getEnrollments(@PathVariable Integer userId) {
        return studentService.getEnrollments(userId);
    }

    @GetMapping("/completed_courses/{userId}")
    public List<MyCourseDTO> completedCourses(@PathVariable Integer userId) {
        return studentService.getCompletedCourses(userId);
    }

    @GetMapping("/schedule/{userId}")
    public List<CourseSection> schedule(@PathVariable Integer userId) {
        return studentService.getSchedule(userId);
    }

    @GetMapping("/enrollment-requests/{userId}")
    public List<EnrollmentRequest> enrollmentRequests(@PathVariable Integer userId) {
        return studentService.getEnrollmentRequests(userId);
    }
    @GetMapping("/grades/distribution/{userId}")
    public GradeDistributionDTO gradeDistribution(@PathVariable Integer userId) {
        return studentService.getGradeDistribution(userId);
    }
}