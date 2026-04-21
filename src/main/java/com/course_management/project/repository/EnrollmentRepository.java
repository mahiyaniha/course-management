package com.course_management.project.repository;

import com.course_management.project.modal.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Integer> {
    List<Enrollment> findByStudent_User_Id(Integer userId);
    List<Enrollment> findBySection_Course_Advisor_User_Id(Integer userId);
    List<Enrollment> findByStudent_User_IdAndStatus(Integer studentId, Enrollment.Status status);

    @Query("""
    SELECT COALESCE(SUM(e.section.course.credit), 0)
    FROM Enrollment e
    WHERE e.student.user.uniqueId = :studentId
    """)
    Integer getTotalCredits(Integer studentId);
}