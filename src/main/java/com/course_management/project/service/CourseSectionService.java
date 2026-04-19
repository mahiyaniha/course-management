package com.course_management.project.service;

import com.course_management.project.modal.CourseSection;
import com.course_management.project.repository.CourseSectionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseSectionService {
    final private CourseSectionRepository courseSectionRepository;

    public CourseSectionService(CourseSectionRepository courseSectionRepository) {
        this.courseSectionRepository = courseSectionRepository;
    }

    public List<CourseSection> findAll() {
        return courseSectionRepository.findAll();
    }

    public CourseSection getCourseSectionById(int id) {
        return courseSectionRepository.findById(id).orElseThrow(() -> new RuntimeException("Section not found"));
    }
}
