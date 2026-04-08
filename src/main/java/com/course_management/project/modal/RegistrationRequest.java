package com.course_management.project.modal;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "registration_requests")
@Data
public class RegistrationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer studentId;
    private String status; // pending/approved/rejected
    private String advisorComment;
}