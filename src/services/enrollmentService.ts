import Database from "better-sqlite3";
import { getDatabaseConnection } from "../db/connection";
import {
  Enrollment,
  EnrollmentFilterOptions,
  EnrollmentListResponse,
  PaginationMeta,
  PaginationQuery
} from "../types/enrollment";

const buildFilterClause = (
  filters: EnrollmentFilterOptions,
  database: Database.Database
): { whereClause: string; parameters: Record<string, unknown> } => {
  const clauses: string[] = [];
  const parameters: Record<string, unknown> = {};

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

export const listEnrollments = (
  filters: EnrollmentFilterOptions,
  pagination: PaginationQuery
): EnrollmentListResponse => {
  const database = getDatabaseConnection();
  const page = pagination.page ?? 1;
  const pageSize = pagination.pageSize ?? 10;
  const offset = (page - 1) * pageSize;

  const { whereClause, parameters } = buildFilterClause(filters, database);

  const totalStatement = database.prepare(
    `SELECT COUNT(*) as total FROM enrollments ${whereClause}`
  );
  const total = (totalStatement.get(parameters) as { total: number }).total;

  const listStatement = database.prepare(
    `SELECT * FROM enrollments ${whereClause} ORDER BY created_at DESC LIMIT :limit OFFSET :offset`
  );

  const items = listStatement.all({ ...parameters, limit: pageSize, offset }) as Enrollment[];

  const paginationMeta: PaginationMeta = {
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize)
  };

  return { items, pagination: paginationMeta };
};

export const getEnrollmentById = (id: number): Enrollment | null => {
  const database = getDatabaseConnection();
  const statement = database.prepare(`SELECT * FROM enrollments WHERE id = ?`);
  const enrollment = statement.get(id) as Enrollment | undefined;
  return enrollment ?? null;
};

export const createEnrollment = (
  payload: Omit<Enrollment, "id" | "created_at" | "updated_at">
): Enrollment => {
  const database = getDatabaseConnection();

  const statement = database.prepare(`
    INSERT INTO enrollments (name, gender, course, contact, remarks)
    VALUES (@name, @gender, @course, @contact, @remarks)
  `);
  const result = statement.run(payload);

  return getEnrollmentById(Number(result.lastInsertRowid)) as Enrollment;
};

export const updateEnrollment = (
  id: number,
  payload: Omit<Enrollment, "id" | "created_at" | "updated_at">
): Enrollment | null => {
  const database = getDatabaseConnection();

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

  return getEnrollmentById(id);
};

export const deleteEnrollment = (id: number): boolean => {
  const database = getDatabaseConnection();
  const statement = database.prepare(`DELETE FROM enrollments WHERE id = ?`);
  const result = statement.run(id);
  return result.changes > 0;
};

export const exportEnrollments = (
  filters: EnrollmentFilterOptions
): Enrollment[] => {
  const database = getDatabaseConnection();
  const { whereClause, parameters } = buildFilterClause(filters, database);
  const statement = database.prepare(`SELECT * FROM enrollments ${whereClause} ORDER BY created_at DESC`);
  const enrollments = statement.all(parameters) as Enrollment[];
  return enrollments;
};
