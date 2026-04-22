package com.course_management.project.service;

import com.course_management.project.dto.AuthResponse;
import com.course_management.project.dto.LoginRequest;
import com.course_management.project.dto.RegisterRequest;
import com.course_management.project.modal.Admin;
import com.course_management.project.modal.Advisor;
import com.course_management.project.modal.Student;
import com.course_management.project.modal.User;
import com.course_management.project.repository.AdminRepository;
import com.course_management.project.repository.AdvisorRepository;
import com.course_management.project.repository.StudentRepository;
import com.course_management.project.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final StudentService studentService;
    private final AdminService adminService;
    private final AdvisorService advisorService;

    public AuthService(
            final UserRepository userRepository,
            final StudentService studentService,
            final AdminService adminService,
            final AdvisorService advisorService
    ) {
        this.userRepository = userRepository;
        this.adminService = adminService;
        this.advisorService = advisorService;
        this.studentService = studentService;
    }

    private Map<String, Object> getUserProfilePic(String byRole, Integer userId) {
        Map<String, Object> hashmap = new HashMap<>();
        String role = byRole.toLowerCase();
        return switch (role) {
            case "admin" -> {
                Admin adminDetails = adminService.getAdminDetails(userId);
                hashmap.put("picture", adminDetails.getPicture());
                yield hashmap;
            }
            case "advisor" -> {
                Advisor advisorDetails = advisorService.getAdvisorDetails(userId);
                hashmap.put("picture", advisorDetails.getPicture());
                yield hashmap;
            }
            case "student" -> {
                Student studentById = studentService.getStudentByUserId(userId);
                hashmap.put("picture", studentById.getPicture());
                yield hashmap;
            }
            default -> new HashMap<>();
        };
    }

    // 🔐 LOGIN
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail());

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // Get profile pic by user role and unique id
        Map<String, Object> userDetails = getUserProfilePic(user.getRole().name(), user.getId());
        String name = user.getFirstName() + " " + user.getLastName();

        return AuthResponse.builder()
                .message("Login successful")
                .name(name)
                .role(user.getRole().name())
                .userId(user.getId())
                .picture((byte[]) userDetails.get("picture"))
                .redirect("/dashboard/" + user.getRole().name().toLowerCase())
                .build();
    }

    // 🧑‍🎓 REGISTER
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()) != null) {
            throw new RuntimeException("Email already exists");
        }

        if (request.getPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(User.Role.valueOf(request.getRole().toUpperCase()));

        User createdUser = userRepository.save(user);

        // Added to student table if role is student
        if (user.getRole() == User.Role.STUDENT) {
            Student student = new Student();
            student.setUser(createdUser);
            student.setDepartment(request.getDepartment());
            student.setCreditCompleted(0);
            student.setStatus(Student.Status.ACTIVE);
            studentService.addNewStudent(student);
        }

        // Added to advisor table if role is advisor
        if (user.getRole() == User.Role.ADVISOR) {
            Advisor advisor = new Advisor();
            advisor.setUser(createdUser);
            advisor.setDepartment(request.getDepartment());
            advisor.setLevel("None");
            advisor.setStatus(Advisor.Status.ACTIVE);
            advisorService.addNewAdvisor(advisor);
        }

        return AuthResponse.builder()
                .message("User registered successfully")
                .role(request.getRole().toLowerCase())
                .redirect("/dashboard/" + request.getRole().toLowerCase())
                .build();
    }
}