package com.course_management.project.modal;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true)
    private String email;

    private String firstName;
    private String lastName;
    private String name;
    private String description;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] picture;
    
    private String address;
    private String phone;
    private String department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "unique_id",
            referencedColumnName = "unique_id"   // IMPORTANT
    )
    private User user;
}

