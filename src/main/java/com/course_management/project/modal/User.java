package com.course_management.project.modal;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "unique_id", unique = true, nullable = false, updatable = false)
    private String uniqueId;

    // 👇 ADD THESE
    private String firstName;
    private String lastName;

    public enum Role {
        STUDENT,
        ADVISOR,
        ADMIN
    }

    @PrePersist
    public void generateUniqueId() {
        this.uniqueId = role.name().toLowerCase() + "_" + System.currentTimeMillis();
    }
}