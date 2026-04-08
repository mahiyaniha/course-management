package com.course_management.project.api;

import com.course_management.project.dto.AddRequestDTO;
import com.course_management.project.dto.DashboardDTO;
import com.course_management.project.modal.CourseSection;
import com.course_management.project.modal.Enrollment;
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

    @GetMapping("/dashboard/{id}")
    public DashboardDTO dashboard(@PathVariable Integer id) {
        return studentService.getDashboard(id);
    }

    @GetMapping("/courses")
    public List<CourseSection> courses() {
        return studentService.getAvailableCourses();
    }

    @PostMapping("/add_request")
    public String add(@RequestBody AddRequestDTO dto) {
        return studentService.addCourse(dto);
    }

    @GetMapping("/my_courses/{id}")
    public List<Enrollment> myCourses(@PathVariable Integer id) {
        return studentService.myCourses(id);
    }

    @GetMapping("/schedule/{id}")
    public List<CourseSection> schedule(@PathVariable Integer id) {
        return studentService.getSchedule(id);
    }

    @GetMapping("/requests/{id}")
    public List<RegistrationRequest> requests(@PathVariable Integer id) {
        return studentService.getRequests(id);
    }
}