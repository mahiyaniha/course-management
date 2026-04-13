package com.course_management.project.modal;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "advisors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Advisor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true)
    private String email;

    private String firstName;
    private String lastName;
    private String name;
    private String description;
    private String picture;
    private String address;
    private String phone;

    private String level;
}
