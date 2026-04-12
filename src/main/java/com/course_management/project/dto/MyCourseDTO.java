package com.course_management.project.dto;

import lombok.Data;

@Data
public class MyCourseDTO {
    private Integer courseId;
    private String courseName;
    private Integer credit;
    private String completedAt;
    private Integer sectionId;
    private String grade;
}