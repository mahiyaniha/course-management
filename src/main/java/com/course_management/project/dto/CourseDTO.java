package com.course_management.project.dto;

import com.course_management.project.modal.Advisor;
import com.course_management.project.modal.Department;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CourseDTO {
    private Integer id;
    private String code;
    private String title;
    private Integer credit;
    private Department department;
    private Advisor advisor;
    private Integer availableSeat;
    private Integer totalSeat;
    private String status;
}