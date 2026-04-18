package com.course_management.project.api;

import com.course_management.project.dto.AdminDTO;
import com.course_management.project.dto.CourseSectionDTO;
import com.course_management.project.dto.StudentDTO;
import com.course_management.project.modal.*;
import com.course_management.project.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminController {

    @Autowired private AdminService adminService;

    // -------------------------
    // USERS
    // -------------------------
    @GetMapping("/users")
    public List<User> getUsers() {
        return adminService.getAllUsers();
    }

    @GetMapping("/{uniqueId}")
    public Admin getAdminById(@PathVariable String uniqueId) {
        return adminService.getAdminDetails(uniqueId);
    }

    @PostMapping(value = "/update-profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProfile(
            @RequestPart("data") AdminDTO dto,
            @RequestPart(value = "photo", required = false) MultipartFile photo
    ) {
        try {
            String api_resp = adminService.updateAdminProfile(dto, photo);
            return ResponseEntity.ok("Admin Profile updated successfully");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating profile");
        }
    }

    @PostMapping("/users")
    public User createUser(@RequestBody User user) {
        return adminService.createUser(user);
    }

    @DeleteMapping("/users/{uniqueId}")
    public String deleteUser(@PathVariable String uniqueId) {
        adminService.deleteUser(uniqueId);
        return "User deleted";
    }

    // -------------------------
    // Departments
    // -------------------------
    @GetMapping("/departments")
    public List<Department> getDepartments() {
        return adminService.getAllDepartments();
    }



    // -------------------------
    // COURSES
    // -------------------------
    @GetMapping("/courses")
    public List<Course> getCourses() {
        return adminService.getCourses();
    }

    @PostMapping("/courses")
    public Course createCourse(@RequestBody Course course) {
        return adminService.createCourse(course);
    }

    @DeleteMapping("/courses/{id}")
    public String deleteCourse(@PathVariable Integer id) {
        adminService.deleteCourse(id);
        return "Course deleted";
    }

    // -------------------------
    // COURSE SECTIONS
    // -------------------------
    @GetMapping("/sections")
    public List<CourseSection> getSections() {
        return adminService.getSections();
    }

    @PostMapping("/sections")
    public CourseSection createSection(@RequestBody CourseSectionDTO dto) {
        return adminService.createSection(dto);
    }

    @DeleteMapping("/sections/{id}")
    public String deleteSection(@PathVariable Integer id) {
        adminService.deleteSection(id);
        return "Section deleted";
    }
}
