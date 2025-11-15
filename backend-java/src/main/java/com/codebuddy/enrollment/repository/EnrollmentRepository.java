package com.codebuddy.enrollment.repository;

import com.codebuddy.enrollment.model.Enrollment;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class EnrollmentRepository {
  private final NamedParameterJdbcTemplate jdbcTemplate;
  private final EnrollmentRowMapper rowMapper = new EnrollmentRowMapper();

  public EnrollmentRepository(NamedParameterJdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  public List<Enrollment> findAll(Map<String, Object> filters, int page, int pageSize) {
    StringBuilder sql = new StringBuilder("SELECT * FROM enrollments WHERE 1=1");
    MapSqlParameterSource params = new MapSqlParameterSource();

    applyFilters(sql, params, filters);

    sql.append(" ORDER BY created_at DESC LIMIT :limit OFFSET :offset");
    params.addValue("limit", pageSize);
    params.addValue("offset", (page - 1) * pageSize);

    return jdbcTemplate.query(sql.toString(), params, rowMapper);
  }

  public long count(Map<String, Object> filters) {
    StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM enrollments WHERE 1=1");
    MapSqlParameterSource params = new MapSqlParameterSource();

    applyFilters(sql, params, filters);

    return jdbcTemplate.queryForObject(sql.toString(), params, Long.class);
  }

  public Optional<Enrollment> findById(long id) {
    String sql = "SELECT * FROM enrollments WHERE id = :id";
    Map<String, Object> params = Map.of("id", id);
    List<Enrollment> results = jdbcTemplate.query(sql, params, rowMapper);
    return results.stream().findFirst();
  }

  public Enrollment save(Enrollment enrollment) {
    String sql = "INSERT INTO enrollments (name, gender, course, contact, remarks) " +
        "VALUES (:name, :gender, :course, :contact, :remarks)";
    MapSqlParameterSource params = new MapSqlParameterSource()
        .addValue("name", enrollment.getName())
        .addValue("gender", enrollment.getGender())
        .addValue("course", enrollment.getCourse())
        .addValue("contact", enrollment.getContact())
        .addValue("remarks", enrollment.getRemarks());

    KeyHolder keyHolder = new GeneratedKeyHolder();
    jdbcTemplate.update(sql, params, keyHolder, new String[]{"id"});

    Number key = keyHolder.getKey();
    if (key != null) {
      enrollment.setId(key.longValue());
    }

    return enrollment;
  }

  public int update(long id, Enrollment enrollment) {
    String sql = "UPDATE enrollments SET name = :name, gender = :gender, course = :course, " +
        "contact = :contact, remarks = :remarks WHERE id = :id";
    MapSqlParameterSource params = new MapSqlParameterSource()
        .addValue("id", id)
        .addValue("name", enrollment.getName())
        .addValue("gender", enrollment.getGender())
        .addValue("course", enrollment.getCourse())
        .addValue("contact", enrollment.getContact())
        .addValue("remarks", enrollment.getRemarks());

    return jdbcTemplate.update(sql, params);
  }

  public int delete(long id) {
    String sql = "DELETE FROM enrollments WHERE id = :id";
    return jdbcTemplate.update(sql, Map.of("id", id));
  }

  public List<Enrollment> findAllForExport(Map<String, Object> filters) {
    StringBuilder sql = new StringBuilder("SELECT * FROM enrollments WHERE 1=1");
    MapSqlParameterSource params = new MapSqlParameterSource();

    applyFilters(sql, params, filters);
    sql.append(" ORDER BY created_at DESC");

    return jdbcTemplate.query(sql.toString(), params, rowMapper);
  }

  private void applyFilters(StringBuilder sql, MapSqlParameterSource params, Map<String, Object> filters) {
    if (filters.containsKey("name")) {
      sql.append(" AND name LIKE :name");
      params.addValue("name", "%" + filters.get("name") + "%");
    }
    if (filters.containsKey("gender")) {
      sql.append(" AND gender = :gender");
      params.addValue("gender", filters.get("gender"));
    }
    if (filters.containsKey("course")) {
      sql.append(" AND course LIKE :course");
      params.addValue("course", "%" + filters.get("course") + "%");
    }
    if (filters.containsKey("contact")) {
      sql.append(" AND contact LIKE :contact");
      params.addValue("contact", "%" + filters.get("contact") + "%");
    }
  }
}
