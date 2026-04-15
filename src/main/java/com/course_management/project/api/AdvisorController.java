package com.course_management.project.api;

import com.course_management.project.dto.AdminDTO;
import com.course_management.project.dto.AdvisorDTO;
import com.course_management.project.dto.AdvisorDecisionDTO;
import com.course_management.project.modal.Admin;
import com.course_management.project.modal.Advisor;
import com.course_management.project.modal.RegistrationRequest;
import com.course_management.project.service.AdvisorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/advisor")
public class AdvisorController {

    @Autowired
    private AdvisorService advisorService;

    @GetMapping("/all")
    public List<Advisor> getAllAdvisors() {
        return advisorService.getAllAdvisors();
    }

    @GetMapping("/{uniqueId}")
    public Advisor getAdvisorById(@PathVariable String uniqueId) {
        return advisorService.getAdvisorDetails(uniqueId);
    }

    @PostMapping(value = "/update-profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProfile(
            @RequestPart("data") AdvisorDTO dto,
            @RequestPart(value = "photo", required = false) MultipartFile photo
    ) {
        try {
            String api_resp = advisorService.updateAdvisorProfile(dto, photo);
            return ResponseEntity.ok("Advisor Profile updated successfully");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating profile");
        }
    }

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