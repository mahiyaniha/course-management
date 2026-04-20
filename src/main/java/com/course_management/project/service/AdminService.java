package com.course_management.project.service;

import com.course_management.project.dto.AdminDTO;
import com.course_management.project.dto.CourseSectionDTO;
import com.course_management.project.dto.StudentDTO;
import com.course_management.project.enums.Day;
import com.course_management.project.modal.*;
import com.course_management.project.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalTime;
import java.util.List;

@Service
public class AdminService {

    @Autowired private AdminRepository adminRepository;
    @Autowired private UserRepository userRepo;
    @Autowired private DepartmentRepository departmentRepository;
    @Autowired private CourseRepository courseRepo;
    @Autowired private CourseSectionRepository sectionRepo;

    // -------------------------
    // USER MANAGEMENT
    // -------------------------
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public Admin getAdminDetails(Integer userId) {
        Admin admin = adminRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("Admin not found"));
        return admin;
    }

    public String updateAdminProfile(AdminDTO dto, MultipartFile photo) throws IOException {
        Admin admin = adminRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // update fields from DTO
        admin.getUser().setEmail(dto.getEmail());
        admin.getUser().setFirstName(dto.getFirstName());
        admin.getUser().setLastName(dto.getLastName());
        admin.setDescription(dto.getDescription());
        admin.setAddress(dto.getAddress());
        admin.setPhone(dto.getPhone());

        // convert image → BLOB
        if (photo != null && !photo.isEmpty()) {
            admin.setPicture(photo.getBytes());
        }
        adminRepository.save(admin);
        return "Profile updated successfully";
    }


    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public User createUser(User user) {
        if (userRepo.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("Email already exists");
        }
        return userRepo.save(user);
    }

    public void deleteUser(String uniqueId) {
        userRepo.deleteByUniqueId(uniqueId);
    }

    // -------------------------
    // COURSE MANAGEMENT
    // -------------------------
    public List<Course> getCourses() {
        return courseRepo.findAll();
    }

    public Course createCourse(Course course) {
        return courseRepo.save(course);
    }

    public void deleteCourse(Integer courseId) {
        courseRepo.deleteById(courseId);
    }

    // -------------------------
    // COURSE SECTION MANAGEMENT
    // -------------------------
    public List<CourseSection> getSections() {
        return sectionRepo.findAll();
    }

    public List<CourseSection> getSectionsByCourseId(final Integer courseId) {
        return sectionRepo.findCourseSectionByCourse_Id(courseId);
    }

    public CourseSection createSection(CourseSectionDTO dto) {
        CourseSection section = new CourseSection();
        section.getCourse().setId(dto.getCourseId());

        String dayUpper = dto.getDay().toUpperCase();
        section.setDay(Day.valueOf(dayUpper));
        section.setStartTime(LocalTime.parse(dto.getStartTime()));
        section.setEndTime(LocalTime.parse(dto.getEndTime()));
        section.setSeatLimit(dto.getSeatLimit());
        section.setSeatTaken(0);
        return sectionRepo.save(section);
    }

    public void deleteSection(Integer sectionId) {
        sectionRepo.deleteById(sectionId);
    }
}