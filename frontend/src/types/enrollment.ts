export interface EnrollmentRecord {
  id: number;
  name: string;
  gender: "男" | "女" | "其他";
  course: string;
  contact: string;
  remarks: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface EnrollmentListResponse {
  items: EnrollmentRecord[];
  pagination: PaginationMeta;
}

export interface EnrollmentFormValues {
  name: string;
  gender: "男" | "女" | "其他" | "";
  course: string;
  contact: string;
  remarks: string;
}

export interface EnrollmentFilterPayload {
  name: string;
  gender: "男" | "女" | "其他" | "";
  course: string;
  contact: string;
}

export interface EnrollmentSearchPayload extends EnrollmentFilterPayload {
  page?: number;
  pageSize?: number;
}
