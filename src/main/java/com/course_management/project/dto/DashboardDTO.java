package com.course_management.project.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardDTO {
    private int totalCourses;
    private int totalCredits;
    private int pending;
    private int approved;
}