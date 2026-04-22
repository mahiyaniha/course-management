package com.course_management.project.repository;

import com.course_management.project.modal.CompletedCourse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CompletedCourseRepository extends JpaRepository<CompletedCourse, Integer> {

    List<CompletedCourse> findByUserId(Integer userId);
}