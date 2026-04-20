package com.course_management.project.dto;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EnrollmentRequestDTO {
    private Integer enrollmentRequestId;
    private Integer userId;
    private Integer studentId;
    private Integer sectionId;
    private Integer courseId;
    private String status;
}