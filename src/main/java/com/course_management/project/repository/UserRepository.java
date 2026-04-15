package com.course_management.project.repository;

import com.course_management.project.modal.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByEmail(String email);
    void deleteByUniqueId(String uniqueId);
}