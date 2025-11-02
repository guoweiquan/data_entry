"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportEnrollmentsHandler = exports.deleteEnrollmentHandler = exports.updateEnrollmentHandler = exports.createEnrollmentHandler = exports.getEnrollmentHandler = exports.listEnrollmentsHandler = void 0;
const exceljs_1 = __importDefault(require("exceljs"));
const enrollmentService_1 = require("../services/enrollmentService");
const buildFiltersFromRequest = (request) => {
    const filters = {};
    const { name, gender, course, contact } = request.query;
    if (name)
        filters.name = String(name);
    if (gender)
        filters.gender = gender;
    if (course)
        filters.course = String(course);
    if (contact)
        filters.contact = String(contact);
    return filters;
};
const buildPaginationFromRequest = (request) => {
    const { page, pageSize } = request.query;
    return {
        page: page ? Number(page) : undefined,
        pageSize: pageSize ? Number(pageSize) : undefined
    };
};
const listEnrollmentsHandler = (request, response) => {
    const filters = buildFiltersFromRequest(request);
    const pagination = buildPaginationFromRequest(request);
    const result = (0, enrollmentService_1.listEnrollments)(filters, pagination);
    response.json({
        code: 200,
        message: "查询成功",
        data: result
    });
};
exports.listEnrollmentsHandler = listEnrollmentsHandler;
const getEnrollmentHandler = (request, response) => {
    const id = Number(request.params.id);
    const enrollment = (0, enrollmentService_1.getEnrollmentById)(id);
    if (!enrollment) {
        response.status(404).json({ code: 404, message: "报名记录不存在" });
        return;
    }
    response.json({ code: 200, message: "查询成功", data: enrollment });
};
exports.getEnrollmentHandler = getEnrollmentHandler;
const createEnrollmentHandler = (request, response) => {
    const payload = request.body;
    const enrollment = (0, enrollmentService_1.createEnrollment)({
        name: payload.name,
        gender: payload.gender,
        course: payload.course,
        contact: payload.contact,
        remarks: payload.remarks ?? null
    });
    response.status(201).json({ code: 201, message: "创建成功", data: enrollment });
};
exports.createEnrollmentHandler = createEnrollmentHandler;
const updateEnrollmentHandler = (request, response) => {
    const id = Number(request.params.id);
    const payload = request.body;
    const result = (0, enrollmentService_1.updateEnrollment)(id, {
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
exports.updateEnrollmentHandler = updateEnrollmentHandler;
const deleteEnrollmentHandler = (request, response) => {
    const id = Number(request.params.id);
    const success = (0, enrollmentService_1.deleteEnrollment)(id);
    if (!success) {
        response.status(404).json({ code: 404, message: "报名记录不存在" });
        return;
    }
    response.json({ code: 200, message: "删除成功" });
};
exports.deleteEnrollmentHandler = deleteEnrollmentHandler;
const exportEnrollmentsHandler = async (request, response) => {
    const filters = buildFiltersFromRequest(request);
    const enrollments = (0, enrollmentService_1.exportEnrollments)(filters);
    const workbook = new exceljs_1.default.Workbook();
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
    response.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    response.setHeader("Content-Disposition", `attachment; filename="enrollments_${Date.now()}.xlsx"`);
    await workbook.xlsx.write(response);
    response.end();
};
exports.exportEnrollmentsHandler = exportEnrollmentsHandler;
