import axios from "axios";
import { ElMessage } from "element-plus";
import {
  EnrollmentFilterPayload,
  EnrollmentFormValues,
  EnrollmentListResponse,
  EnrollmentSearchPayload
} from "../types/enrollment";

const apiClient = axios.create({
  baseURL: "/api/enrollments",
  timeout: 10000
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    ElMessage.error("请求发送失败");
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || "请求失败";
    ElMessage.error(message);
    return Promise.reject(error);
  }
);

export const enrollmentApi = {
  async list(params: EnrollmentSearchPayload): Promise<EnrollmentListResponse> {
    const response = await apiClient.get("/", { params });
    return response.data.data;
  },
  async create(payload: EnrollmentFormValues): Promise<void> {
    await apiClient.post("/", payload);
    ElMessage.success("新增报名成功");
  },
  async update(id: number, payload: EnrollmentFormValues): Promise<void> {
    await apiClient.put(`/${id}`, payload);
    ElMessage.success("更新报名成功");
  },
  async remove(id: number): Promise<void> {
    await apiClient.delete(`/${id}`);
    ElMessage.success("删除报名成功");
  },
  async export(filters: EnrollmentFilterPayload): Promise<Blob> {
    const response = await apiClient.get("/export", {
      params: filters,
      responseType: "blob"
    });
    ElMessage.success("导出成功");
    return response.data;
  }
};
