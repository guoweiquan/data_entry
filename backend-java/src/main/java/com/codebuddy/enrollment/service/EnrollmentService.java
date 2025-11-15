package com.codebuddy.enrollment.service;

import com.codebuddy.enrollment.dto.EnrollmentListResponse;
import com.codebuddy.enrollment.dto.EnrollmentRequest;
import com.codebuddy.enrollment.dto.EnrollmentResponse;
import com.codebuddy.enrollment.model.Enrollment;
import com.codebuddy.enrollment.repository.EnrollmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {
  private static final int DEFAULT_PAGE = 1;
  private static final int DEFAULT_PAGE_SIZE = 10;

  private final EnrollmentRepository enrollmentRepository;

  public EnrollmentService(EnrollmentRepository enrollmentRepository) {
    this.enrollmentRepository = enrollmentRepository;
  }

  public EnrollmentListResponse listEnrollments(Map<String, String> queryParams) {
    Map<String, Object> filters = buildFilters(queryParams);
    int page = parsePositiveInt(queryParams.get("page"), DEFAULT_PAGE);
    int pageSize = parsePositiveInt(queryParams.get("pageSize"), DEFAULT_PAGE_SIZE);

    long total = enrollmentRepository.count(filters);
    List<EnrollmentResponse> items = enrollmentRepository
        .findAll(filters, page, pageSize)
        .stream()
        .map(this::toResponse)
        .collect(Collectors.toList());

    EnrollmentListResponse response = new EnrollmentListResponse();
    response.setItems(items);

    EnrollmentListResponse.PaginationMeta pagination = new EnrollmentListResponse.PaginationMeta();
    pagination.setPage(page);
    pagination.setPageSize(pageSize);
    pagination.setTotal(total);
    pagination.setTotalPages((long) Math.ceil((double) total / pageSize));

    response.setPagination(pagination);
    return response;
  }

  public Optional<EnrollmentResponse> getEnrollment(long id) {
    return enrollmentRepository.findById(id).map(this::toResponse);
  }

  @Transactional
  public EnrollmentResponse createEnrollment(EnrollmentRequest request) {
    Enrollment enrollment = new Enrollment();
    enrollment.setName(request.getName());
    enrollment.setGender(request.getGender());
    enrollment.setCourse(request.getCourse());
    enrollment.setContact(request.getContact());
    enrollment.setRemarks(request.getRemarks());
    enrollment.setCreatedAt(LocalDateTime.now());
    enrollment.setUpdatedAt(LocalDateTime.now());

    Enrollment saved = enrollmentRepository.save(enrollment);
    return enrollmentRepository.findById(saved.getId()).map(this::toResponse).orElseThrow();
  }

  @Transactional
  public Optional<EnrollmentResponse> updateEnrollment(long id, EnrollmentRequest request) {
    Optional<Enrollment> existing = enrollmentRepository.findById(id);
    if (existing.isEmpty()) {
      return Optional.empty();
    }

    Enrollment enrollment = existing.get();
    enrollment.setName(request.getName());
    enrollment.setGender(request.getGender());
    enrollment.setCourse(request.getCourse());
    enrollment.setContact(request.getContact());
    enrollment.setRemarks(request.getRemarks());
    enrollment.setUpdatedAt(LocalDateTime.now());

    int changes = enrollmentRepository.update(id, enrollment);
    if (changes == 0) {
      return Optional.empty();
    }

    return enrollmentRepository.findById(id).map(this::toResponse);
  }

  @Transactional
  public boolean deleteEnrollment(long id) {
    int changes = enrollmentRepository.delete(id);
    return changes > 0;
  }

  private Map<String, Object> buildFilters(Map<String, String> queryParams) {
    Map<String, Object> filters = new HashMap<>();
    if (queryParams.containsKey("name")) {
      filters.put("name", queryParams.get("name"));
    }
    if (queryParams.containsKey("gender")) {
      filters.put("gender", queryParams.get("gender"));
    }
    if (queryParams.containsKey("course")) {
      filters.put("course", queryParams.get("course"));
    }
    if (queryParams.containsKey("contact")) {
      filters.put("contact", queryParams.get("contact"));
    }
    return filters;
  }

  private int parsePositiveInt(String value, int defaultValue) {
    if (value == null) {
      return defaultValue;
    }
    try {
      int parsed = Integer.parseInt(value);
      return parsed > 0 ? parsed : defaultValue;
    } catch (NumberFormatException exception) {
      return defaultValue;
    }
  }

  private EnrollmentResponse toResponse(Enrollment enrollment) {
    EnrollmentResponse response = new EnrollmentResponse();
    response.setId(enrollment.getId());
    response.setName(enrollment.getName());
    response.setGender(enrollment.getGender());
    response.setCourse(enrollment.getCourse());
    response.setContact(enrollment.getContact());
    response.setRemarks(enrollment.getRemarks());
    response.setCreatedAt(enrollment.getCreatedAt());
    response.setUpdatedAt(enrollment.getUpdatedAt());
    return response;
  }
}
