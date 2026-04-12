package com.course_management.project.modal;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "completed_courses")
@Data
public class CompletedCourse {

    @EmbeddedId
    private CompletedCourseKey id;

    // ⭐ NEW FIELDS (STEP 4 UPGRADE)
    private String grade;

    private LocalDate completedAt;
}