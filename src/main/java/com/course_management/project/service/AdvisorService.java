package com.course_management.project.service;

import com.course_management.project.dto.AdminDTO;
import com.course_management.project.dto.AdvisorDTO;
import com.course_management.project.dto.AdvisorDecisionDTO;
import com.course_management.project.modal.*;
import com.course_management.project.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class AdvisorService {

    @Autowired
    private RequestRepository requestRepo;

    @Autowired
    private RequestItemRepository itemRepo;

    @Autowired
    private EnrollmentRepository enrollRepo;

    @Autowired
    private CourseSectionRepository sectionRepo;

    @Autowired
    private NotificationRepository notificationRepo;

    @Autowired
    private AdvisorRepository advisorRepository;

    public List<Advisor> getAllAdvisors() {
        return advisorRepository.findAll();
    }

    public  Advisor getAdvisorDetails(String uniqueId) {
        Advisor advisor = advisorRepository
                .findByUniqueId(uniqueId).orElseThrow(() -> new RuntimeException("Advisor not found"));
        return advisor;
    }

    public String updateAdvisorProfile(AdvisorDTO dto, MultipartFile photo) throws IOException {
        Advisor advisor = advisorRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Advisor not found"));

        // update fields from DTO
        advisor.setEmail(dto.getEmail());
        advisor.setFirstName(dto.getFirstName());
        advisor.setLastName(dto.getLastName());
        advisor.setName(dto.getName());
        advisor.setDescription(dto.getDescription());
        advisor.setAddress(dto.getAddress());
        advisor.setPhone(dto.getPhone());

        // convert image → BLOB
        if (photo != null && !photo.isEmpty()) {
            advisor.setPicture(photo.getBytes());
        }
        advisorRepository.save(advisor);
        return "Profile updated successfully";
    }


    // Get all pending requests
    public List<RegistrationRequest> getPendingRequests() {
        return requestRepo.findByStatus("pending");
    }

    // Approve request
    public String approveRequest(AdvisorDecisionDTO dto) {

        RegistrationRequest req = requestRepo.findById(dto.getRequestId())
                .orElseThrow(() -> new RuntimeException("Request not found"));

        List<RegistrationRequestItem> items = itemRepo.findByRequestId(req.getId());

        for (RegistrationRequestItem item : items) {

            // Auto-enroll student
            Enrollment e = new Enrollment();
            e.setStudentId(req.getStudentId());
            e.setSectionId(item.getSectionId());
            enrollRepo.save(e);

            // Increment seat taken
            CourseSection section = sectionRepo.findById(item.getSectionId()).orElseThrow();
            section.setSeatTaken(section.getSeatTaken() + 1);
            sectionRepo.save(section);
        }

        req.setStatus("approved");
        req.setAdvisorComment(dto.getComment());
        requestRepo.save(req);

        // Notify student
        Notification n = new Notification();
        n.setUserId(req.getStudentId());
        n.setMessage("Your course request #" + req.getId() + " has been approved.");
        notificationRepo.save(n);

        return "Request approved successfully";
    }

    // Reject request
    public String rejectRequest(AdvisorDecisionDTO dto) {

        RegistrationRequest req = requestRepo.findById(dto.getRequestId())
                .orElseThrow(() -> new RuntimeException("Request not found"));

        req.setStatus("rejected");
        req.setAdvisorComment(dto.getComment());
        requestRepo.save(req);

        // Notify student
        Notification n = new Notification();
        n.setUserId(req.getStudentId());
        n.setMessage("Your course request #" + req.getId() + " has been rejected. Comment: " + dto.getComment());
        notificationRepo.save(n);

        return "Request rejected successfully";
    }
}