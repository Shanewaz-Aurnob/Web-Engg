import { NextFunction, Request, Response } from "express";
import db from "../database";
import { AddressFilter } from "../filters/AddressFilter";
import { DepartmentFilter } from "../filters/DepartmentFilter";
import { StudentFilter } from "../filters/studentFilter";
import { SQLError } from "../helper/SQLError";
import { addAddressFilters } from "../helper/addAddressFilters";
import { addDepartmentFilters } from "../helper/addDepartmentFilters";
import { addStudentFilter } from "../helper/addStudentFilters";
import { CourseFilter } from "../filters/CourseFilter";
import { addCourseFilters } from "../helper/addCourseFilters";

export function paginatedResults(
  table:
    | "Address"
    | "Department"
    | "Image"
    | "Roles"
    | "Student"
    | "Teacher"
    | "User"
    | "Course",
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.max(3, Number(req.query.limit) || 10);

      // Filter params
      const addrFilter: AddressFilter | undefined =
        table === "Address" ? AddressFilter.fromRequest(req) : undefined;
      const deptFilter: DepartmentFilter | undefined =
        table === "Department" ? DepartmentFilter.fromRequest(req) : undefined;
      const studFilter: StudentFilter | undefined =
        table === "Student" ? StudentFilter.fromRequest(req) : undefined;

      const courseFilter: CourseFilter | undefined =
        table === "Course" ? CourseFilter.fromRequest(req) : undefined;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      var query = db.selectFrom(table);

      if (addrFilter) {
        query = addAddressFilters(addrFilter, query);
      } else if (deptFilter) {
        query = addDepartmentFilters(deptFilter, query);
      } else if (studFilter) {
        query = addStudentFilter(studFilter, query);
      } else if (courseFilter){
        query= addCourseFilters(courseFilter,query);

      }

      const data = await query
        .selectAll()
        .limit(limit)
        .offset(startIndex)
        .execute();
      const count = await query
        .select(({ fn, val, ref }) => [fn.countAll<number>().as("total")])
        .executeTakeFirst();
      const totalRecords = count?.total || 0;

      const result = {
        total_records: totalRecords,
        total_data: data.length,
        data,
        page_count: Math.ceil(totalRecords / limit),
        first_page: 1,
        next:
          endIndex < totalRecords
            ? {
                page: page + 1,
                limit,
              }
            : null,
        previous:
          page > 1
            ? {
                page: page - 1,
                limit,
              }
            : null,
      };

      return res.status(200).json(result);
    } catch (error) {
      try {
        const sqlError = error as SQLError;
        return res.status(500).json({
          message: "Invalid query",
          error: sqlError.message,
          errorno: sqlError.errorno,
        });
      } catch (error) {
        return res.status(500).json({
          message: "Internal server error",
          error,
        });
      }
    }
  };
}
