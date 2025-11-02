export interface Enrollment {
  id: number;
  name: string;
  gender: "男" | "女" | "其他";
  course: string;
  contact: string;
  remarks: string | null;
  created_at: string;
  updated_at: string;
}

export interface EnrollmentFilterOptions {
  name?: string;
  gender?: "男" | "女" | "其他";
  course?: string;
  contact?: string;
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface EnrollmentListResponse {
  items: Enrollment[];
  pagination: PaginationMeta;
}
