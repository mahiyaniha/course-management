package com.course_management.project.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String name;
    private Integer departmentId;
    private String role;
}