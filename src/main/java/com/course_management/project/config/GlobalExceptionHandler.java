package com.course_management.project.config;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleError(RuntimeException ex) {
        return ResponseEntity.badRequest().body(
                java.util.Map.of("error", ex.getMessage())
        );
    }
}