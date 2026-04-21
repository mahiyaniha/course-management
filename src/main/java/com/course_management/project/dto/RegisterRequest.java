package com.course_management.project.dto;

import com.course_management.project.modal.Department;
import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private Department department;
    private String role;
}