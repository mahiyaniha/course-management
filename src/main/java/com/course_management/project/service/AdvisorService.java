package com.course_management.project.service;

import com.course_management.project.dto.AdvisorDecisionDTO;
import com.course_management.project.modal.*;
import com.course_management.project.repository.CourseSectionRepository;
import com.course_management.project.repository.EnrollmentRepository;
import com.course_management.project.repository.RequestItemRepository;
import com.course_management.project.repository.NotificationRepository;
import com.course_management.project.repository.RequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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