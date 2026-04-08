package com.course_management.project.dto;

import lombok.Data;

@Data
public class AdvisorDecisionDTO {
    private Integer requestId;
    private String comment; // optional for approval, required for rejection
}