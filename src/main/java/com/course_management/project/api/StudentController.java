package com.course_management.project.api;

import com.course_management.project.dto.AddRequestDTO;
import com.course_management.project.dto.DashboardDTO;
import com.course_management.project.dto.GradeDistributionDTO;
import com.course_management.project.dto.MyCourseDTO;
import com.course_management.project.modal.CourseSection;
import com.course_management.project.modal.RegistrationRequest;
import com.course_management.project.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/student")
public class StudentController {

    @Autowired
    private StudentService studentService;

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
    public String add(@RequestBody AddRequestDTO dto) {
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