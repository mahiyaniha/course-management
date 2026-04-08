package com.course_management.project.modal;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalTime;

@Entity
@Table(name = "course_sections")
@Data
public class CourseSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer courseId;
    private String instructor;

    private String day;
    private LocalTime startTime;
    private LocalTime endTime;

    private Integer seatLimit;
    private Integer seatTaken;
}