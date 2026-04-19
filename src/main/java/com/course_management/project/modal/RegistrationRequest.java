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

    private String firstName;
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @OneToOne
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    public enum Role {
        STUDENT,
        ADVISOR,
    }

    @Enumerated(EnumType.STRING)
    private Status status;

    public enum Status {
        PENDING,
        REJECTED,
        APPROVED
    }
}