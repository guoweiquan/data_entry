package com.codebuddy.enrollment.controller;

import com.codebuddy.enrollment.dto.EnrollmentListResponse;
import com.codebuddy.enrollment.dto.EnrollmentRequest;
import com.codebuddy.enrollment.dto.EnrollmentResponse;
import com.codebuddy.enrollment.service.EnrollmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {
  private final EnrollmentService enrollmentService;

  public EnrollmentController(EnrollmentService enrollmentService) {
    this.enrollmentService = enrollmentService;
  }

  @GetMapping
  public ResponseEntity<EnrollmentListResponse> listEnrollments(@RequestParam Map<String, String> queryParams) {
    EnrollmentListResponse response = enrollmentService.listEnrollments(queryParams);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/{id}")
  public ResponseEntity<EnrollmentResponse> getEnrollment(@PathVariable("id") long id) {
    Optional<EnrollmentResponse> enrollment = enrollmentService.getEnrollment(id);
    return enrollment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<EnrollmentResponse> createEnrollment(@Valid @RequestBody EnrollmentRequest request) {
    EnrollmentResponse response = enrollmentService.createEnrollment(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @PutMapping("/{id}")
  public ResponseEntity<EnrollmentResponse> updateEnrollment(
      @PathVariable("id") long id,
      @Valid @RequestBody EnrollmentRequest request
  ) {
    Optional<EnrollmentResponse> updated = enrollmentService.updateEnrollment(id, request);
    return updated.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteEnrollment(@PathVariable("id") long id) {
    boolean deleted = enrollmentService.deleteEnrollment(id);
    if (!deleted) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.noContent().build();
  }
}
