import express from "express";
import db from "../../database"
import {z} from "zod"

const certificateWithdrawalCommon = express.Router();

certificateWithdrawalCommon.get("/see-details", async (req, res)=>{
    try{
     const form_id  = z.coerce.number().parse(req.query.form_id);
     const userID = z.coerce.string().parse(req.query.user_id);

     let role: any = await db.selectFrom("Roles")
     .where(({and, eb}) =>and([
       eb("Roles.user_id", "=",userID),
       eb("Roles.end_date", "is", null)
     ]))
     .select([ "Roles.role"])
     .executeTakeFirst()
     console.log(role)

     if(!role){
        let student = await db.selectFrom("Student")
        .where("Student.user_id", "=", userID).select("Student.student_id").executeTakeFirst();
        if(student) role = "student"
        else role = ""
     }
     else role = role?.role

     const allRoles = ["provost", "certificate_verifier2", "certificate_verifier1", "certificate_section_incharge", "exam_controller", "vice_chancellor", "student"]
     if(!role || !( allRoles.includes(role?.toLowerCase()))) 
         throw new Error("User not authorized");
    
     const formInfo= await db.selectFrom("Certificate_Withdrawal_Form")
     .innerJoin("Certificate_Form_History", "Certificate_Form_History.cf_form_id", "Certificate_Withdrawal_Form.form_id")
     .where("Certificate_Withdrawal_Form.form_id", "=", form_id)
     .selectAll().execute();
 
    const attachments = await db.selectFrom("Certificate_Withdrawal_Attachments")
   .where("Certificate_Withdrawal_Attachments.form_id", "=", form_id)
   .select([
     "Certificate_Withdrawal_Attachments.attachment",
     "Certificate_Withdrawal_Attachments.attachment_name"
   ]).execute();
 
    let verifications
    if(role === "student"){
        verifications = await db.selectFrom("Certificate_Form_Verification")
        .innerJoin("Roles", "Certificate_Form_Verification.authority_id", "Roles.user_id")
        .where("Certificate_Form_Verification.form_id", "=", form_id).select([
          "Certificate_Form_Verification.status",
          "Certificate_Form_Verification.comment",
          "Certificate_Form_Verification.verification_date",
          "Roles.role"
        ])
        .execute()
    }
    else{
        verifications = await db.selectFrom("Certificate_Form_Verification")
        .innerJoin("Roles", "Certificate_Form_Verification.authority_id", "Roles.user_id")
        .where(({and, eb}) => and([
            eb("Certificate_Form_Verification.form_id", "=", form_id),
            eb("Certificate_Form_Verification.authority_id", "=", userID)
        ]))
        .select([
        "Certificate_Form_Verification.status",
        "Certificate_Form_Verification.comment",
        "Certificate_Form_Verification.verification_date",
        "Roles.role"
        ]).execute() 
    }
     const data= {
       data: formInfo,
       attachments: attachments,
       verifications: verifications,
     }
     if(formInfo?.length) 
         res.status(200).json(data)
         else res.status(404).json({message: "Data not found"}) 
    }catch(error){
       console.log(error);
       res.status(500).json({ message: "Internal server error", error });
      }
 })

export default certificateWithdrawalCommon