package com.course_management.project.service;

import com.course_management.project.modal.CompletedCourse;
import com.course_management.project.modal.Course;
import com.course_management.project.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {
    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public int getCompletedCredit(List<CompletedCourse> completedList) {
        int sum = completedList.stream()
                .mapToInt(c -> courseRepository.findById(c.getId().getCourseId())
                        .orElseThrow()
                        .getCredit())
                .sum();

        return sum;
    }

    public Course getCourseById(Integer courseId) {
        return courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("No course found"));
    }
}
