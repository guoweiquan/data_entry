import { Request, Response } from "express";
import { validationResult } from "express-validator";
import ExcelJS from "exceljs";
import {
  listEnrollments,
  getEnrollmentById,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
  exportEnrollments
} from "../services/enrollmentService";
import { EnrollmentFilterOptions, PaginationQuery } from "../types/enrollment";

const buildFiltersFromRequest = (request: Request): EnrollmentFilterOptions => {
  const filters: EnrollmentFilterOptions = {};
  const { name, gender, course, contact } = request.query;

  if (name) filters.name = String(name);
  if (gender) filters.gender = gender as "男" | "女" | "其他";
  if (course) filters.course = String(course);
  if (contact) filters.contact = String(contact);

  return filters;
};

const buildPaginationFromRequest = (request: Request): PaginationQuery => {
  const { page, pageSize } = request.query;
  return {
    page: page ? Number(page) : undefined,
    pageSize: pageSize ? Number(pageSize) : undefined
  };
};

export const listEnrollmentsHandler = (request: Request, response: Response): void => {
  const filters = buildFiltersFromRequest(request);
  const pagination = buildPaginationFromRequest(request);
  const result = listEnrollments(filters, pagination);

  response.json({
    code: 200,
    message: "查询成功",
    data: result
  });
};

export const getEnrollmentHandler = (request: Request, response: Response): void => {
  const id = Number(request.params.id);
  const enrollment = getEnrollmentById(id);

  if (!enrollment) {
    response.status(404).json({ code: 404, message: "报名记录不存在" });
    return;
  }

  response.json({ code: 200, message: "查询成功", data: enrollment });
};

export const createEnrollmentHandler = (request: Request, response: Response): void => {
  const payload = request.body;
  const enrollment = createEnrollment({
    name: payload.name,
    gender: payload.gender,
    course: payload.course,
    contact: payload.contact,
    remarks: payload.remarks ?? null
  });

  response.status(201).json({ code: 201, message: "创建成功", data: enrollment });
};

export const updateEnrollmentHandler = (request: Request, response: Response): void => {
  const id = Number(request.params.id);
  const payload = request.body;
  const result = updateEnrollment(id, {
    name: payload.name,
    gender: payload.gender,
    course: payload.course,
    contact: payload.contact,
    remarks: payload.remarks ?? null
  });

  if (!result) {
    response.status(404).json({ code: 404, message: "报名记录不存在" });
    return;
  }

  response.json({ code: 200, message: "更新成功", data: result });
};

export const deleteEnrollmentHandler = (request: Request, response: Response): void => {
  const id = Number(request.params.id);
  const success = deleteEnrollment(id);

  if (!success) {
    response.status(404).json({ code: 404, message: "报名记录不存在" });
    return;
  }

  response.json({ code: 200, message: "删除成功" });
};

export const exportEnrollmentsHandler = async (
  request: Request,
  response: Response
): Promise<void> => {
  const filters = buildFiltersFromRequest(request);
  const enrollments = exportEnrollments(filters);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("报名信息");

  worksheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "姓名", key: "name", width: 20 },
    { header: "性别", key: "gender", width: 10 },
    { header: "课程", key: "course", width: 30 },
    { header: "联系方式", key: "contact", width: 30 },
    { header: "备注", key: "remarks", width: 40 },
    { header: "创建时间", key: "created_at", width: 25 },
    { header: "更新时间", key: "updated_at", width: 25 }
  ];

  enrollments.forEach((enrollment) => {
    worksheet.addRow({
      ...enrollment,
      remarks: enrollment.remarks ?? ""
    });
  });

  response.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  response.setHeader(
    "Content-Disposition",
    `attachment; filename="enrollments_${Date.now()}.xlsx"`
  );

  await workbook.xlsx.write(response);
  response.end();
};
