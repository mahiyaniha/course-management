package com.course_management.project.repository;

import com.course_management.project.modal.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Integer> {
    List<Enrollment> findByStudentId(Integer studentId);

    List<Enrollment> findByAdvisor_User_UniqueId(String uniqueId);
    List<Enrollment> findByStudent_User_UniqueId(String uniqueId);

    @Query("""
    SELECT COALESCE(SUM(e.section.course.credit), 0)
    FROM Enrollment e
    WHERE e.student.user.uniqueId = :studentId
    """)
    Integer getTotalCredits(Integer studentId);
}