package com.course_management.project.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentAnalyticsDTO {
    String semester;
    Integer totalDeptCredits;
    Integer totalActiveCredits;
    Integer totalCompletedCredits;

    Integer totalCompletedCourses;
    Integer totalActiveCourses;

    Integer totalRequests;
    Integer totalApprovedRequests;
    Integer totalPendingRequests;
    Integer totalRejectedRequests;

    Double totalAvgCgpa;
}
