package com.course_management.project.service;

import com.course_management.project.dto.CourseSectionDTO;
import com.course_management.project.modal.Course;
import com.course_management.project.modal.CourseSection;
import com.course_management.project.modal.Department;
import com.course_management.project.modal.User;
import com.course_management.project.repository.CourseRepository;
import com.course_management.project.repository.CourseSectionRepository;
import com.course_management.project.repository.DepartmentRepository;
import com.course_management.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;

@Service
public class AdminService {

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

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public User createUser(User user) {
        if (userRepo.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("Email already exists");
        }
        return userRepo.save(user);
    }

    public void deleteUser(Integer userId) {
        userRepo.deleteById(userId);
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

    public CourseSection createSection(CourseSectionDTO dto) {
        CourseSection section = new CourseSection();
        section.setCourseId(dto.getCourseId());
        section.setInstructor(dto.getInstructor());
        section.setDay(dto.getDay());
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