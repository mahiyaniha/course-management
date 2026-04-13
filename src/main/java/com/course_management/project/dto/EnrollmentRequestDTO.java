package com.course_management.project.dto;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EnrollmentRequestDTO {
    private Integer studentId;
    private Integer courseId;
    private Integer advisorId;
    private String status;
}