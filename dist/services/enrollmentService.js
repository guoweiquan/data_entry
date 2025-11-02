"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportEnrollments = exports.deleteEnrollment = exports.updateEnrollment = exports.createEnrollment = exports.getEnrollmentById = exports.listEnrollments = void 0;
const connection_1 = require("../db/connection");
const buildFilterClause = (filters, database) => {
    const clauses = [];
    const parameters = {};
    if (filters.name) {
        clauses.push("name LIKE :name");
        parameters.name = `%${filters.name}%`;
    }
    if (filters.gender) {
        clauses.push("gender = :gender");
        parameters.gender = filters.gender;
    }
    if (filters.course) {
        clauses.push("course LIKE :course");
        parameters.course = `%${filters.course}%`;
    }
    if (filters.contact) {
        clauses.push("contact LIKE :contact");
        parameters.contact = `%${filters.contact}%`;
    }
    const whereClause = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
    return { whereClause, parameters };
};
const listEnrollments = (filters, pagination) => {
    const database = (0, connection_1.getDatabaseConnection)();
    const page = pagination.page ?? 1;
    const pageSize = pagination.pageSize ?? 10;
    const offset = (page - 1) * pageSize;
    const { whereClause, parameters } = buildFilterClause(filters, database);
    const totalStatement = database.prepare(`SELECT COUNT(*) as total FROM enrollments ${whereClause}`);
    const total = totalStatement.get(parameters).total;
    const listStatement = database.prepare(`SELECT * FROM enrollments ${whereClause} ORDER BY created_at DESC LIMIT :limit OFFSET :offset`);
    const items = listStatement.all({ ...parameters, limit: pageSize, offset });
    const paginationMeta = {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
    };
    return { items, pagination: paginationMeta };
};
exports.listEnrollments = listEnrollments;
const getEnrollmentById = (id) => {
    const database = (0, connection_1.getDatabaseConnection)();
    const statement = database.prepare(`SELECT * FROM enrollments WHERE id = ?`);
    const enrollment = statement.get(id);
    return enrollment ?? null;
};
exports.getEnrollmentById = getEnrollmentById;
const createEnrollment = (payload) => {
    const database = (0, connection_1.getDatabaseConnection)();
    const statement = database.prepare(`
    INSERT INTO enrollments (name, gender, course, contact, remarks)
    VALUES (@name, @gender, @course, @contact, @remarks)
  `);
    const result = statement.run(payload);
    return (0, exports.getEnrollmentById)(Number(result.lastInsertRowid));
};
exports.createEnrollment = createEnrollment;
const updateEnrollment = (id, payload) => {
    const database = (0, connection_1.getDatabaseConnection)();
    const updateStatement = database.prepare(`
    UPDATE enrollments
    SET name = @name,
        gender = @gender,
        course = @course,
        contact = @contact,
        remarks = @remarks
    WHERE id = @id
  `);
    const result = updateStatement.run({ ...payload, id });
    if (result.changes === 0) {
        return null;
    }
    return (0, exports.getEnrollmentById)(id);
};
exports.updateEnrollment = updateEnrollment;
const deleteEnrollment = (id) => {
    const database = (0, connection_1.getDatabaseConnection)();
    const statement = database.prepare(`DELETE FROM enrollments WHERE id = ?`);
    const result = statement.run(id);
    return result.changes > 0;
};
exports.deleteEnrollment = deleteEnrollment;
const exportEnrollments = (filters) => {
    const database = (0, connection_1.getDatabaseConnection)();
    const { whereClause, parameters } = buildFilterClause(filters, database);
    const statement = database.prepare(`SELECT * FROM enrollments ${whereClause} ORDER BY created_at DESC`);
    const enrollments = statement.all(parameters);
    return enrollments;
};
exports.exportEnrollments = exportEnrollments;
