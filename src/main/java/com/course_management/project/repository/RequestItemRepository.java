package com.course_management.project.repository;

import com.course_management.project.modal.RegistrationRequestItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RequestItemRepository extends JpaRepository<RegistrationRequestItem, Integer> {
    List<RegistrationRequestItem> findByRequestId(Integer requestId);
}