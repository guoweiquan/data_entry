package com.codebuddy.enrollment.repository;

import com.codebuddy.enrollment.model.Enrollment;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class EnrollmentRowMapper implements RowMapper<Enrollment> {
  private static final DateTimeFormatter SQLITE_TIMESTAMP_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

  @Override
  public Enrollment mapRow(ResultSet rs, int rowNum) throws SQLException {
    Enrollment enrollment = new Enrollment();
    enrollment.setId(rs.getLong("id"));
    enrollment.setName(rs.getString("name"));
    enrollment.setGender(rs.getString("gender"));
    enrollment.setCourse(rs.getString("course"));
    enrollment.setContact(rs.getString("contact"));
    enrollment.setRemarks(rs.getString("remarks"));
    enrollment.setCreatedAt(parseTimestamp(rs, "created_at"));
    enrollment.setUpdatedAt(parseTimestamp(rs, "updated_at"));
    return enrollment;
  }

  private LocalDateTime parseTimestamp(ResultSet resultSet, String columnName) throws SQLException {
    String value = resultSet.getString(columnName);
    if (value == null) {
      return null;
    }
    return LocalDateTime.parse(value, SQLITE_TIMESTAMP_FORMATTER);
  }
}
