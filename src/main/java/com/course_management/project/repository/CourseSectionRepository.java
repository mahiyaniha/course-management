package com.course_management.project.repository;

import com.course_management.project.modal.CourseSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseSectionRepository extends JpaRepository<CourseSection, Integer> {
    List<CourseSection> findCourseSectionByCourse_Id(Integer courseId);
}
