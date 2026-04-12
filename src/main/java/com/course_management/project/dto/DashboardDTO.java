package com.course_management.project.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardDTO {

    private int totalCourses;
    private int totalCredits;

    // NEW
    private int completedCourses;
    private int completedCredits;

    private double completionRate;

    private int pending;
    private int approved;

    private String activeSemester;
    private double cgpa;
}