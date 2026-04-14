package com.course_management.project.api;

import com.course_management.project.dto.*;
import com.course_management.project.modal.CourseSection;
import com.course_management.project.modal.EnrollmentRequest;
import com.course_management.project.modal.RegistrationRequest;
import com.course_management.project.modal.Student;
import com.course_management.project.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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

    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable Integer id) {
        return studentService.getStudentById(id);
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
    public DashboardDTO dashboard(@PathVariable Integer id) {
        return studentService.getDashboard(id);
    }

    // 📚 AVAILABLE COURSES
    @GetMapping("/courses")
    public List<CourseSection> courses() {
        return studentService.getAvailableCourses();
    }

    // 🔥 ADD COURSE REQUEST
    @PostMapping("/add_request")
    public String add(@RequestBody EnrollmentRequestDTO dto) {
        return studentService.addCourse(dto);
    }

    // 📘 MY COURSES
    @GetMapping("/my_courses/{id}")
    public List<MyCourseDTO> myCourses(@PathVariable Integer id) {
        return studentService.myCourses(id);
    }

    // 🆕 COMPLETED COURSES
    @GetMapping("/completed_courses/{id}")
    public List<MyCourseDTO> completedCourses(@PathVariable Integer id) {
        return studentService.getCompletedCourses(id);
    }

    // 🗓️ SCHEDULE
    @GetMapping("/schedule/{id}")
    public List<CourseSection> schedule(@PathVariable Integer id) {
        return studentService.getSchedule(id);
    }

    // 📜 REQUEST HISTORY
    @GetMapping("/requests/{id}")
    public List<RegistrationRequest> requests(@PathVariable Integer id) {
        return studentService.getRequests(id);
    }
    @GetMapping("/grades/distribution/{id}")
    public GradeDistributionDTO gradeDistribution(@PathVariable Integer id) {
        return studentService.getGradeDistribution(id);
    }
}