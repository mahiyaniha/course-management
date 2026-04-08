package com.course_management.project.api;

import com.course_management.project.dto.AdvisorDecisionDTO;
import com.course_management.project.modal.RegistrationRequest;
import com.course_management.project.service.AdvisorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/advisor")
public class AdvisorController {

    @Autowired
    private AdvisorService advisorService;

    // View pending requests
    @GetMapping("/requests")
    public List<RegistrationRequest> pendingRequests() {
        return advisorService.getPendingRequests();
    }

    // Approve request
    @PostMapping("/approve")
    public String approve(@RequestBody AdvisorDecisionDTO dto) {
        return advisorService.approveRequest(dto);
    }

    // Reject request
    @PostMapping("/reject")
    public String reject(@RequestBody AdvisorDecisionDTO dto) {
        return advisorService.rejectRequest(dto);
    }
}