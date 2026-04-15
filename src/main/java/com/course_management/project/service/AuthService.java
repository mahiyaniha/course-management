package com.course_management.project.service;

import com.course_management.project.dto.AuthResponse;
import com.course_management.project.dto.LoginRequest;
import com.course_management.project.dto.RegisterRequest;
import com.course_management.project.modal.User;
import com.course_management.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepo;

    // 🔐 LOGIN
    public AuthResponse login(LoginRequest request) {

        User user = userRepo.findByEmail(request.getEmail());

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return AuthResponse.builder()
                .message("Login successful")
                .role(user.getRole().name())
                .uniqueId(user.getUniqueId())
                .redirect("/dashboard/" + user.getRole().name().toLowerCase())
                .build();
    }

    // 🧑‍🎓 REGISTER
    public AuthResponse register(RegisterRequest request) {

        if (userRepo.findByEmail(request.getEmail()) != null) {
            throw new RuntimeException("Email already exists");
        }

        if (request.getPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(User.Role.valueOf(request.getRole().toUpperCase()));

        userRepo.save(user);

        return AuthResponse.builder()
                .message("User registered successfully")
                .role(request.getRole().toLowerCase())
                .redirect("/dashboard/" + request.getRole().toLowerCase())
                .build();
    }
}