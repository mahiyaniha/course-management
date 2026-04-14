package com.course_management.project.dto;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class StudentDTO {
    private Integer id;
    private String email;
    private String firstName;
    private String lastName;
    private String name;
    private String description;
    private String address;
    private String phone;
    private String department;
}

