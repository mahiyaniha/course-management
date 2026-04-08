package com.course_management.project.dto;

import lombok.Data;

@Data
public class CourseSectionDTO {
    private Integer courseId;
    private String instructor;
    private String day;
    private String startTime; // HH:mm
    private String endTime;   // HH:mm
    private Integer seatLimit;
}
