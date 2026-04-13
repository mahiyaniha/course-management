package com.course_management.project.modal;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "enrollments_request")
@Data
public class EnrollmentRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer studentId;
    private Integer courseId;
    private Integer advisorId;
    private String status;
}