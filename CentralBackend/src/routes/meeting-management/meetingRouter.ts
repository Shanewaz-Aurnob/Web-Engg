import express from "express";
import nodemailer from "nodemailer";
import { z } from "zod";
import db from "../../database";

const meetingRouter = express.Router();

// Route to retrieve a specific meeting by meeting_id
meetingRouter.get("/agenda/:meeting_id", async (req, res) => {
  try {
    const meeting_id = z.coerce.number().parse(req.params.meeting_id);

    // Fetch meeting details
    const meeting = await db
      .selectFrom("Meeting")
      .innerJoin(
        "Meeting_Agenda",
        "Meeting.meeting_id",
        "Meeting_Agenda.meeting_id",
      )
      .where("Meeting.meeting_id", "=", meeting_id)
      .selectAll()
      .execute();

    if (!meeting || meeting.length === 0) {
      return res
        .status(404)
        .json({ message: `Meeting with id ${meeting_id} not found` });
    }

    res.status(200).json(meeting);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        name: "Invalid data type.",
        message: JSON.parse(error.message),
      });
    }
    res.status(500).json({ message: "Internal server error", error });
  }
});

// Validation schema for creating a new meeting
const meetingBody = z.object({
  meeting_id: z.number(),
  meeting_type: z.string(),
  selected_date: z.string(),
  agenda: z.array(
    z.object({
      topic: z.string(),
      description: z.string(),
      decision: z.string(),
    }),
  ),
  room_name: z.string(),
  selected_attendees: z.array(z.string()),
  department_id: z.number(),
  signature_url: z.string(),
});

// Route to create a new meeting
meetingRouter.post("/create-meeting", async (req, res) => {
  try {
    const {
      meeting_id,
      meeting_type,
      selected_date,
      agenda,
      room_name,
      selected_attendees,
      department_id,
      signature_url,
    } = meetingBody.parse(req.body);

    console.log("Parsed Data:", {
      meeting_id,
      meeting_type,
      selected_date,
      room_name,
      selected_attendees,
      department_id,
    });

    const roomResult = await db
      .insertInto("Meeting_Room")
      .values({ room_name })
      .onDuplicateKeyUpdate({ room_name: room_name })
      .executeTakeFirstOrThrow();

    const room_id =
      roomResult.insertId !== undefined ? Number(roomResult.insertId) : 0;

    const typeResult = await db
      .insertInto("Meeting_Type")
      .values({ meeting_type })
      .onDuplicateKeyUpdate({ meeting_type: meeting_type })
      .executeTakeFirstOrThrow();

    const type_id =
      typeResult.insertId !== undefined ? Number(typeResult.insertId) : 0;

    const meetingResult = await db
      .insertInto("Meeting")
      .values({
        meeting_id,
        meeting_type_id: type_id,
        meeting_room_id: room_id,
        meeting_agenda_id: null,
        department_id,
        meeting_time: new Date(selected_date),
        pdf_url: "",
        signature_url: signature_url,
      })
      .executeTakeFirstOrThrow();

    const meetingDbId =
      meetingResult.insertId !== undefined ? Number(meetingResult.insertId) : 0;

    const agendaIds = [];
    for (const item of agenda) {
      const agendaResult = await db
        .insertInto("Meeting_Agenda")
        .values({
          topic: item.topic,
          description: item.description,
          decision: item.decision,
          meeting_id,
        })
        .executeTakeFirstOrThrow();
      agendaIds.push(
        agendaResult.insertId !== undefined ? Number(agendaResult.insertId) : 0,
      );
    }

    const attendeesValues = selected_attendees.map((attendee) => ({
      user_id: attendee,
      meeting_id: meeting_id,
    }));

    await db.insertInto("Meeting_Attend").values(attendeesValues).execute();

    res.status(200).json({ message: "Meeting created successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        name: "Invalid data type",
        message: JSON.parse(error.message),
      });
    }
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

meetingRouter.get("/attendees/:meeting_id", async (req, res) => {
  try {
    const meeting_id = z.coerce.number().parse(req.params.meeting_id);

    // Fetch meeting details
    const attendees = await db
      .selectFrom("User")
      .innerJoin("Meeting_Attend", "User.user_id", "Meeting_Attend.user_id")
      .leftJoin("Teacher", "User.user_id", "Teacher.user_id")
      .where("Meeting_Attend.meeting_id", "=", meeting_id)
      .selectAll()
      .execute();

    if (!attendees || attendees.length === 0) {
      return res
        .status(404)
        .json({ message: `Meeting with id ${meeting_id} not found` });
    }

    res.status(200).json(attendees);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        name: "Invalid data type.",
        message: JSON.parse(error.message),
      });
    }
    res.status(500).json({ message: "Internal server error", error });
  }
});

meetingRouter.get("/meetingInfo", async (req, res) => {
  try {
    // Fetch meeting all details(history)
    const meetinginfo = await db
      .selectFrom("Meeting")
      .innerJoin(
        "Meeting_Type",
        "Meeting.meeting_type_id",
        "Meeting_Type.meeting_type_id",
      )
      .selectAll()
      .execute();

    res.status(200).json(meetinginfo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        name: "Invalid data type.",
        message: JSON.parse(error.message),
      });
    }
    res.status(500).json({ message: "Internal server error", error });
  }
});

const updatePdfSchema = z.object({
  meeting_id: z.number(),
  pdf_url: z.string(),
});

// save meeting minutes
meetingRouter.put("/save-minutes", async (req, res) => {
  try {
    const { meeting_id, pdf_url } = updatePdfSchema.parse(req.body);

    if (isNaN(meeting_id)) {
      return res.status(400).json({ message: "Invalid meeting ID" });
    }
    const result = await db
      .updateTable("Meeting")
      .set({ pdf_url })
      .where("meeting_id", "=", meeting_id)
      .executeTakeFirstOrThrow();

    const numUpdatedRows = Number(result.numUpdatedRows);

    // Check if the update affected any rows
    if (numUpdatedRows === 0) {
      return res
        .status(404)
        .json({ message: "No meeting found with the specified ID" });
    }
    const convertedResult = JSON.parse(
      JSON.stringify(result, (key, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );

    res.status(200).json({
      message: "Meeting minutes updated successfully",
      updated: convertedResult,
    });
  } catch (error) {
    console.error("Error occurred:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        name: "Invalid data type.",
        message: JSON.parse(error.message),
      });
    }
  }
});

const updateSignaturefield = z.object({
  meeting_id: z.number(),
  signature_url: z.string(),
});
meetingRouter.put("/save-signature", async (req, res) => {
  try {
    const { meeting_id, signature_url } = updateSignaturefield.parse(req.body);

    if (isNaN(meeting_id)) {
      return res.status(400).json({ message: "Invalid meeting ID" });
    }
    const result = await db
      .updateTable("Meeting")
      .set({ signature_url })
      .where("meeting_id", "=", meeting_id)
      .executeTakeFirstOrThrow();

    const numUpdatedRows = Number(result.numUpdatedRows);

    // Check if the update affected any rows
    if (numUpdatedRows === 0) {
      return res
        .status(404)
        .json({ message: "No meeting found with the specified ID" });
    }
    const convertedResult = JSON.parse(
      JSON.stringify(result, (key, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );

    res.status(200).json({
      message: "Meeting minutes updated successfully",
      updated: convertedResult,
    });
  } catch (error) {
    console.error("Error occurred:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        name: "Invalid data type.",
        message: JSON.parse(error.message),
      });
    }
  }
});

meetingRouter.get("/get-signature/:meeting_id", async (req, res) => {
  try {
    const meeting_id = z.coerce.number().parse(req.params.meeting_id);

    const meetinginfo = await db
      .selectFrom("Meeting")
      .where("Meeting.meeting_id", "=", meeting_id)
      .select("Meeting.signature_url")
      .executeTakeFirst();

    res.status(200).json(meetinginfo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        name: "Invalid data type.",
        message: JSON.parse(error.message),
      });
    }
    res.status(500).json({ message: "Internal server error", error });
  }
});

meetingRouter.get("/get-minutes/:meeting_id", async (req, res) => {
  try {
    const meeting_id = z.coerce.number().parse(req.params.meeting_id);

    const meetinginfo = await db
      .selectFrom("Meeting")
      .where("Meeting.meeting_id", "=", meeting_id)
      .select("Meeting.pdf_url")
      .executeTakeFirst();

    res.status(200).json(meetinginfo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        name: "Invalid data type.",
        message: JSON.parse(error.message),
      });
    }
    res.status(500).json({ message: "Internal server error", error });
  }
});

meetingRouter.get("/meetingInfo/:meeting_id", async (req, res) => {
  try {
    const meeting_id = z.coerce.number().parse(req.params.meeting_id);
    // Fetch specific meeting all details
    const meetinginfo = await db
      .selectFrom("Meeting")
      .innerJoin(
        "Meeting_Type",
        "Meeting.meeting_type_id",
        "Meeting_Type.meeting_type_id",
      )
      .innerJoin(
        "Meeting_Room",
        "Meeting.meeting_room_id",
        "Meeting_Room.meeting_room_id",
      )
      .innerJoin(
        "Department",
        "Department.department_id",
        "Meeting.department_id",
      )
      .where("Meeting.meeting_id", "=", meeting_id)

      .selectAll()
      .execute();

    if (meetinginfo.length === 0) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.status(200).json(meetinginfo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        name: "Invalid data type.",
        message: JSON.parse(error.message),
      });
    }
    res.status(500).json({ message: "Internal server error", error });
  }
});

meetingRouter.delete("/delete/:meeting_id", async (req, res) => {
  try {
    const meeting_id = z.coerce.number().parse(req.params.meeting_id);

    // Delete related entries in Meeting_Attend
    await db
      .deleteFrom("Meeting_Attend")
      .where("Meeting_Attend.meeting_id", "=", meeting_id)
      .execute();

    // Delete related entries in Meeting_Agenda
    await db
      .deleteFrom("Meeting_Agenda")
      .where("Meeting_Agenda.meeting_id", "=", meeting_id)
      .execute();

    // Delete the meeting
    const deleteResult = await db
      .deleteFrom("Meeting")
      .where("Meeting.meeting_id", "=", meeting_id)
      .executeTakeFirst();

    const affectedRows = Number(deleteResult.numDeletedRows);
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.status(200).json({ message: "Meeting deleted successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        name: "Invalid data type.",
        message: JSON.parse(error.message),
      });
    }
    res.status(500).json({ message: "Internal server error", error });
  }
});

const updateDecisionsSchema = z.object({
  decisions: z.array(z.string().max(300)),
});

meetingRouter.put("/save-decisions/:meeting_id", async (req, res) => {
  try {
    const meeting_id = parseInt(req.params.meeting_id, 10);
    const { decisions } = updateDecisionsSchema.parse(req.body);

    if (isNaN(meeting_id)) {
      return res.status(400).json({ message: "Invalid meeting ID" });
    }

    const agendas = await db
      .selectFrom("Meeting_Agenda")
      .selectAll()
      .where("meeting_id", "=", meeting_id)
      .execute();

    if (agendas.length === 0) {
      return res
        .status(404)
        .json({ message: "No agendas found for the specified meeting ID" });
    }

    if (agendas.length !== decisions.length) {
      return res.status(400).json({
        message: "Number of decisions does not match number of agendas",
      });
    }

    // Begin transaction
    await db.transaction().execute(async (trx) => {
      for (let i = 0; i < agendas.length; i++) {
        const agenda = agendas[i];
        const decision = decisions[i];

        const result = await trx
          .updateTable("Meeting_Agenda")
          .set({ decision })
          .where("meeting_agenda_id", "=", agenda.meeting_agenda_id)
          .executeTakeFirstOrThrow();

        if (Number(result.numUpdatedRows) === 0) {
          throw new Error(
            `Failed to update agenda ID: ${agenda.meeting_agenda_id}`,
          );
        }
      }
    });

    res.status(200).json({ message: "Decisions updated successfully" });
  } catch (error) {
    console.error("Error occurred:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        name: "Invalid data type.",
        message: JSON.parse(error.message),
      });
    }

    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "meetingmanagement37@gmail.com",
    pass: "keyj vhpl qtby ojvp ",
  },
});

const sendEmailSchema = z.object({
  meeting_id: z.string(),
  subject:z.string(),
  body:z.string(),
  to_email: z.array(z.string()),
  attachment: z.string(),
});

meetingRouter.post("/send-email", async (req, res) => {
  try {
    const { meeting_id,subject,body, to_email, attachment } = sendEmailSchema.parse(
      req.body,
    );
    
    const mailOptions = {
      from: "meetingmanagement37@gmail.com",
      to: to_email.join(","),
      subject: subject,
      text: body,
      attachments: [
        {
          filename: `Meeting-${meeting_id}.pdf`,
          content: attachment,
          encoding: "base64",
        },
      ],
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
});

export default meetingRouter;
