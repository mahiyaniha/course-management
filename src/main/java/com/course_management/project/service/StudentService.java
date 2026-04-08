package com.course_management.project.service;

import com.course_management.project.dto.AddRequestDTO;
import com.course_management.project.dto.DashboardDTO;
import com.course_management.project.modal.CourseSection;
import com.course_management.project.modal.Enrollment;
import com.course_management.project.modal.RegistrationRequest;
import com.course_management.project.modal.RegistrationRequestItem;
import com.course_management.project.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    @Autowired
    private CourseSectionRepository sectionRepo;
    @Autowired private EnrollmentRepository enrollRepo;
    @Autowired private CourseRepository courseRepo;
    @Autowired private RequestRepository requestRepo;
    @Autowired private RequestItemRepository itemRepo;

    // 📊 DASHBOARD
    public DashboardDTO getDashboard(Integer studentId) {

        int totalCourses = enrollRepo.findByStudentId(studentId).size();
        int totalCredits = enrollRepo.getTotalCredits(studentId) == null ? 0 : enrollRepo.getTotalCredits(studentId);

        return DashboardDTO.builder()
                .totalCourses(totalCourses)
                .totalCredits(totalCredits)
                .pending(requestRepo.countByStudentIdAndStatus(studentId, "pending"))
                .approved(requestRepo.countByStudentIdAndStatus(studentId, "approved"))
                .build();
    }

    // 📚 AVAILABLE COURSES
    public List<CourseSection> getAvailableCourses() {
        return sectionRepo.findAll();
    }

    // 🔥 ADD COURSE REQUEST (SMART LOGIC)
    public String addCourse(AddRequestDTO dto) {

        CourseSection section = sectionRepo.findById(dto.getSectionId()).orElseThrow();

        // 1. Seat Check
        if (section.getSeatTaken() >= section.getSeatLimit()) {
            throw new RuntimeException("No seats available");
        }

        // 2. Time Clash
        List<Enrollment> enrollments = enrollRepo.findByStudentId(dto.getStudentId());

        for (Enrollment e : enrollments) {
            CourseSection s = sectionRepo.findById(e.getSectionId()).orElseThrow();

            boolean clash = s.getDay().equals(section.getDay()) &&
                    !(section.getEndTime().isBefore(s.getStartTime()) ||
                            section.getStartTime().isAfter(s.getEndTime()));

            if (clash) throw new RuntimeException("Time clash detected");
        }

        // 3. Credit Limit
        Integer currentCredits = enrollRepo.getTotalCredits(dto.getStudentId());
        currentCredits = currentCredits == null ? 0 : currentCredits;

        int newCredits = courseRepo.findById(section.getCourseId()).get().getCredit();

        if (currentCredits + newCredits > 18) {
            throw new RuntimeException("Credit limit exceeded");
        }

        // 4. Create Request
        RegistrationRequest req = new RegistrationRequest();
        req.setStudentId(dto.getStudentId());
        req.setStatus("pending");
        requestRepo.save(req);

        RegistrationRequestItem item = new RegistrationRequestItem();
        item.setRequestId(req.getId());
        item.setSectionId(section.getId());
        itemRepo.save(item);

        return "Request submitted";
    }

    // 📘 MY COURSES
    public List<Enrollment> myCourses(Integer studentId) {
        return enrollRepo.findByStudentId(studentId);
    }

    // 🗓️ SCHEDULE
    public List<CourseSection> getSchedule(Integer studentId) {

        List<Enrollment> enrollments = enrollRepo.findByStudentId(studentId);

        return enrollments.stream()
                .map(e -> sectionRepo.findById(e.getSectionId()).orElseThrow())
                .toList();
    }

    // 📜 REQUEST HISTORY
    public List<RegistrationRequest> getRequests(Integer studentId) {
        return requestRepo.findByStudentId(studentId);
    }
}