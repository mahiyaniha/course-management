package com.course_management.project.repository;

import com.course_management.project.modal.CompletedCourse;
import com.course_management.project.modal.CompletedCourseKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CompletedCourseRepository extends JpaRepository<CompletedCourse, CompletedCourseKey> {

    List<CompletedCourse> findByIdStudentId(Integer studentId);
}