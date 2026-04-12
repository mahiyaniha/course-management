package com.course_management.project.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GradeDistributionDTO {

    private int aPlus;
    private int a;
    private int aMinus;
    private int bPlus;
    private int b;
    private int c;
    private int d;
}