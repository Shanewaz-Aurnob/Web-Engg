import express from "express";
import { z } from "zod";
import db from "../../database";
import { addFiltration } from "../../helper/addFiltration";
import { paginatedResults } from "../../helper/paginatedResults";
import { sql } from "kysely";
import { SessionRequest, verifySession } from "../../middlewares/verifySession";
import {
  checkPermissions,
  PermissionRequest,
  Role,
} from "../../middlewares/checkPermissions";
const taskRouter = express.Router();


taskRouter.get("/",async(req,res)=>{
    try{
        const query=db.selectFrom("Assign_Task")
        .innerJoin("User", "User.user_id", "Assign_Task.assign_by")
        .select(["User.user_id", "User.first_name", "User.last_name", 
        "Assign_Task.task_id", "Assign_Task.assign_by",
        "Assign_Task.assign_to","Assign_Task.assign_date", "Assign_Task.due_date", "Assign_Task.task_title",
        "Assign_Task.task_description", "Assign_Task.task_attachment", "Assign_Task.task_status"])
  
     paginatedResults(query, req, res);
    } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
})
taskRouter.get("/mytasks", verifySession, async (req: SessionRequest, res) => {
  try {
    const query = db
      .selectFrom("Assign_Task")
      .innerJoin("User", "User.user_id", "Assign_Task.assign_by")
      .where("assign_to", "=", req.session?.user_id!)
      .select(["User.user_id", "User.first_name", "User.last_name", 
        "Assign_Task.task_id", "Assign_Task.assign_by",
        "Assign_Task.assign_to", "Assign_Task.due_date", "Assign_Task.assign_date","Assign_Task.task_title",
        "Assign_Task.task_description", "Assign_Task.task_attachment", "Assign_Task.task_status"])

    paginatedResults(query, req, res);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

 const add_new_task=z.object({
    assign_to: z.string(),
    due_date: z.preprocess((arg) => (typeof arg === 'string' ? new Date(arg) : arg), z.date()),
    task_title: z.string(),
    task_description: z.string(),
    task_attachment: z.string(),
    task_status: z.number().min(0).max(1)
 })

 //adding new task to a specific staff
taskRouter.post("/add",
  verifySession,
  checkPermissions,
  async (req: PermissionRequest, res) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }
    try {
      const uid = req.session?.user_id;
      const reqBod = add_new_task.parse(req.body);
      await db
        .insertInto("Assign_Task")
        .values({
          ...reqBod,
          assign_by: uid!,
          assign_date: new Date(),
        } as any)
        .execute();

      const row = await db
        .selectFrom("Assign_Task")
        .select(sql<string>`LAST_INSERT_ID()`.as("task_id"))
        .executeTakeFirst();

      if (!row) {
        return res.status(500).json({
          message: "Failed to create notice",
         
        });
      }
  
      // Send a success response
      res.status(200).json({
        success: true,
        message: "Task added successfully to Assign_Task table.",
        form_id: row.task_id,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          name: "Invalid data type.",
          message: error.errors,
        });
      }
      return res.status(500).json({ success: false, message: "Internal server error", error });
    }
  });

  const updateTaskBody=z.object({
    assign_to: z.string().optional(),
    due_date: z.preprocess((arg) => (typeof arg === 'string' ? new Date(arg) : arg), z.date()).optional(),
    task_title: z.string().optional(),
    task_description: z.string().optional(),
    task_attachment: z.string().optional(),
    task_status: z.number().min(0).max(1).optional()
  }

  )
  taskRouter.put("/update/:id", verifySession, checkPermissions, async (req: PermissionRequest, res) => {
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }
    try {
      const uid = req.session?.user_id!;
      const id = z.coerce.number().parse(req.params.id);
      const {
        assign_to,
        due_date,
        task_title,
        task_description,
        task_attachment,
        task_status
      } = updateTaskBody.parse(req.body);

      if(
        !assign_to &&
        !due_date &&
        !task_title &&
        !task_description &&
        !task_attachment &&
        !task_status
        ) {return res.status(400).json({ success: false, message: "No field to update" })
      };
      var query=db
        .updateTable("Assign_Task")
        .where('task_id', '=', id)
        .where((eb)=>eb('assign_to',"=",uid).or ('assign_by',"=",uid)
        )

        if(task_status){
          query=query.set("task_status",task_status)
        }
        if(due_date){
          query=query.set("due_date",due_date)
        }
        if(assign_to){
          query=query.set("assign_to",assign_to)
        }
        if(task_title){
          query=query.set("task_title",task_title)
        }
        if(task_description){
          query=query.set("task_description",task_description)
        }
        if(task_attachment){
          query=query.set("task_attachment",task_attachment)
        }
        await query.execute();

        return res.status(200).json({ success: true, message: `Task with id ${id} updated successfully` });

        
    }
      catch(error){
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            name: "Invalid data type.",
            message: JSON.parse(error.message),
          });
        }
  
        return res.status(500).json({ success: false, message: "Internal server error", error });
      }

    })

  taskRouter.delete('delete/:id',verifySession,async(req:PermissionRequest,res)=>{
    if (req.role != Role.Teacher && req.role != Role.Staff) {
      return res.status(403).json({
        message: "You don't have enough permissions to access this document.",
      });
    }
    try{
      const uid = req.session?.user_id!;
      const id = z.coerce.number().parse(req.params.id);
      await db
      .deleteFrom("Assign_Task")
      .where("task_id", "=", id)
      .where((eb)=>eb('assign_to',"=",uid).or ('assign_by',"=",uid)
      )
      .execute();
    }
    catch(error){
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(error.message),
        });
      }
      res.status(500).json({ message: "Internal server error", error });
    }
  })
  
export default taskRouter;