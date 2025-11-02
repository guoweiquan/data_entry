import { defineStore } from "pinia";
import {
  EnrollmentFilterPayload,
  EnrollmentFormValues,
  EnrollmentListResponse,
  EnrollmentRecord,
  EnrollmentSearchPayload,
  PaginationMeta
} from "../types/enrollment";
import { enrollmentApi } from "../services/enrollmentApi";
import { downloadFile } from "../utils/download";

interface State {
  enrollments: EnrollmentRecord[];
  pagination: PaginationMeta;
}

const defaultPagination: PaginationMeta = {
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0
};

export const useEnrollmentStore = defineStore("enrollment", {
  state: (): State => ({
    enrollments: [],
    pagination: defaultPagination
  }),
  actions: {
    async fetchEnrollments(params: EnrollmentSearchPayload): Promise<void> {
      const response = await enrollmentApi.list(params);
      this.enrollments = response.items;
      this.pagination = response.pagination;
    },
    async createEnrollment(payload: EnrollmentFormValues): Promise<void> {
      await enrollmentApi.create(payload);
    },
    async updateEnrollment(id: number, payload: EnrollmentFormValues): Promise<void> {
      await enrollmentApi.update(id, payload);
    },
    async deleteEnrollment(id: number): Promise<void> {
      await enrollmentApi.remove(id);
    },
    async exportEnrollments(filters: EnrollmentFilterPayload): Promise<void> {
      const blob = await enrollmentApi.export(filters);
      downloadFile(blob, `报名信息_${Date.now()}.xlsx`);
    }
  }
});
