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

    @GetMapping("/{uniqueId}")
    public Student getStudentById(@PathVariable String uniqueId) {
        return studentService.getStudentById(uniqueId);
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
    @GetMapping("/dashboard/{id}")
    public DashboardDTO dashboard(@PathVariable String id) {
        return studentService.getDashboard(id);
    }

    // 📚 AVAILABLE COURSES
    @GetMapping("/courses")
    public List<CourseSection> courses() {
        return studentService.getAvailableCourses();
    }

    // 🔥 ADD COURSE REQUEST
    @PostMapping("/add_request")
    public ResponseEntity<?> add(@RequestBody EnrollmentRequestDTO dto) {
        String resp = studentService.addCourse(dto);
        Map<String, String> respMap = new HashMap<>();
        respMap.put("message", resp);
        return ResponseEntity.ok(respMap);
    }

    // 📘 MY COURSES
    @GetMapping("/my_courses/{id}")
    public List<MyCourseDTO> myCourses(@PathVariable String id) {
        return studentService.myCourses(id);
    }

    @GetMapping("/enrollments/{uniqueId}")
    public List<Enrollment> getEnrollments(@PathVariable String uniqueId) {
        return studentService.getEnrollments(uniqueId);
    }

    // 🆕 COMPLETED COURSES
    @GetMapping("/completed_courses/{id}")
    public List<MyCourseDTO> completedCourses(@PathVariable String id) {
        return studentService.getCompletedCourses(id);
    }

    // 🗓️ SCHEDULE
    @GetMapping("/schedule/{id}")
    public List<CourseSection> schedule(@PathVariable String id) {
        return studentService.getSchedule(id);
    }

    // 📜 REQUEST HISTORY
    @GetMapping("/requests/{id}")
    public List<RegistrationRequest> requests(@PathVariable String id) {
        return studentService.getRequests(id);
    }
    @GetMapping("/grades/distribution/{id}")
    public GradeDistributionDTO gradeDistribution(@PathVariable String id) {
        return studentService.getGradeDistribution(id);
    }
}