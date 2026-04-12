package com.course_management.project.modal;

import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;

@Embeddable
@Data
public class CompletedCourseKey implements Serializable {

    private Integer studentId;
    private Integer courseId;
}