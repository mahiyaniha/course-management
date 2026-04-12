package com.course_management.project.repository;

import com.course_management.project.modal.Semester;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SemesterRepository extends JpaRepository<Semester, Integer> {

    Semester findByActive(Integer active);
}