package com.codebuddy.enrollment.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class Enrollment {
  private Long id;

  @NotBlank(message = "姓名不能为空")
  @Size(max = 50, message = "姓名长度不能超过50个字符")
  private String name;

  @NotBlank(message = "性别不能为空")
  @Pattern(regexp = "男|女|其他", message = "性别取值必须为男、女或其他")
  private String gender;

  @NotBlank(message = "课程不能为空")
  @Size(max = 100, message = "课程名称长度不能超过100个字符")
  private String course;

  @NotBlank(message = "联系方式不能为空")
  @Size(max = 100, message = "联系方式长度不能超过100个字符")
  private String contact;

  @Size(max = 1000, message = "备注长度不能超过1000个字符")
  private String remarks;

  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getGender() {
    return gender;
  }

  public void setGender(String gender) {
    this.gender = gender;
  }

  public String getCourse() {
    return course;
  }

  public void setCourse(String course) {
    this.course = course;
  }

  public String getContact() {
    return contact;
  }

  public void setContact(String contact) {
    this.contact = contact;
  }

  public String getRemarks() {
    return remarks;
  }

  public void setRemarks(String remarks) {
    this.remarks = remarks;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
  }
}
