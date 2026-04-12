package com.course_management.project.modal;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "semesters")
@Data
public class Semester {

    @Id
    private Integer id;

    private String name;

    private Integer active;
}