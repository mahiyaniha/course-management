package com.course_management.project.service;

import com.course_management.project.dto.AdminDTO;
import com.course_management.project.dto.AdvisorDTO;
import com.course_management.project.dto.AdvisorDecisionDTO;
import com.course_management.project.dto.EnrollmentRequestDTO;
import com.course_management.project.modal.*;
import com.course_management.project.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class AdvisorService {
    final private AdvisorRepository advisorRepository;

    public AdvisorService(
            final AdvisorRepository advisorRepository) {
        this.advisorRepository = advisorRepository;
    }

    public List<Advisor> getAllAdvisors() {
        return advisorRepository.findAll();
    }

    public  Advisor getAdvisorDetails(Integer userId) {
        Advisor advisor = advisorRepository
                .findByUserId(userId).orElseThrow(() -> new RuntimeException("Advisor not found"));
        return advisor;
    }

    public String updateAdvisorProfile(AdvisorDTO dto, MultipartFile photo) throws IOException {
        Advisor advisor = advisorRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Advisor not found"));

        // update fields from DTO
        advisor.getUser().setEmail(dto.getEmail());
        advisor.getUser().setFirstName(dto.getFirstName());
        advisor.getUser().setLastName(dto.getLastName());
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

    public void addNewAdvisor(Advisor advisor) {
        advisorRepository.save(advisor);
    }
}