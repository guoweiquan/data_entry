package com.codebuddy.enrollment.dto;

import java.util.List;

public class EnrollmentListResponse {
  private List<EnrollmentResponse> items;
  private PaginationMeta pagination;

  public List<EnrollmentResponse> getItems() {
    return items;
  }

  public void setItems(List<EnrollmentResponse> items) {
    this.items = items;
  }

  public PaginationMeta getPagination() {
    return pagination;
  }

  public void setPagination(PaginationMeta pagination) {
    this.pagination = pagination;
  }

  public static class PaginationMeta {
    private int page;
    private int pageSize;
    private long total;
    private long totalPages;

    public int getPage() {
      return page;
    }

    public void setPage(int page) {
      this.page = page;
    }

    public int getPageSize() {
      return pageSize;
    }

    public void setPageSize(int pageSize) {
      this.pageSize = pageSize;
    }

    public long getTotal() {
      return total;
    }

    public void setTotal(long total) {
      this.total = total;
    }

    public long getTotalPages() {
      return totalPages;
    }

    public void setTotalPages(long totalPages) {
      this.totalPages = totalPages;
    }
  }
}
