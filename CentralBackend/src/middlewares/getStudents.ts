import { NextFunction, Response } from "express";
import { PermissionRequest, Role } from "./checkPermissions";

export function getStudents(req: PermissionRequest, res: Response, next: NextFunction) {
    if(req.role != Role.Teacher && req.role != Role.Staff) {
        return res.sendStatus(403);
    }

    next();
}