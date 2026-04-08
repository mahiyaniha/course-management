package com.course_management.project.repository;

import com.course_management.project.modal.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Integer> {
    List<Enrollment> findByStudentId(Integer studentId);

    @Query("SELECT SUM(c.credit) FROM Enrollment e JOIN CourseSection s ON e.sectionId=s.id JOIN Course c ON s.courseId=c.id WHERE e.studentId=:studentId")
    Integer getTotalCredits(Integer studentId);
}