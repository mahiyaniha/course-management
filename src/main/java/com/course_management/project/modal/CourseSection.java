package com.course_management.project.modal;

import com.course_management.project.enums.Day;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Enumerated(EnumType.STRING)
    private Day day;

    private LocalTime startTime;
    private LocalTime endTime;

    private Integer seatLimit;
    private Integer seatTaken;
}