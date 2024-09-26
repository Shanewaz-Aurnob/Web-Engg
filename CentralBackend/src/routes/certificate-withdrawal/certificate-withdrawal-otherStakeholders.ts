import express from "express";
import db from "../../database"
import {z} from "zod"
import { certificateDataSplitting } from "./certificate-data-splitting";

const certificateWithdrawalOtherStakeholders = express.Router();

certificateWithdrawalOtherStakeholders.get("/search-formData/:user_id", async(req, res)=>{
    const userID = z.coerce.string().parse(req.params.user_id);
    const authorizedRoles = ["provost", "certificate_verifier2", "certificate_verifier1", "certificate_section_incharge", "exam_controller", "vice_chancellor"]
    try{
      let role: any = await db.selectFrom("Roles")
      .where(({and, eb}) =>and([
        eb("Roles.user_id", "=",userID),
        eb("Roles.end_date", "is", null)
      ]))
      .select(["Roles.factor", "Roles.role"])
      .executeTakeFirst()
  
      if(!role 
        || !( authorizedRoles.includes(role?.role?.toLowerCase()))
        ) return res.send({message: "User unauthorized!"})
      let {factor} = role
      let allForms: any=[]
      let formId: any =[]
      if(role?.role?.toLowerCase() === "provost"){
         factor = factor?.split("_")
         let hallName = factor?.map((f: any)  => f[0].toUpperCase()+f.slice(1,).toLowerCase()).join(" ")
         
          allForms = await db.selectFrom("Certificate_Form_History")
          .innerJoin("Certificate_Withdrawal_Form", "Certificate_Form_History.cf_form_id", "Certificate_Withdrawal_Form.form_id")
         .where(({and, eb})=>and([
          eb("Certificate_Form_History.hall_name", "=", hallName),
         ])).select([
            "Certificate_Form_History.cf_form_id",
            "Certificate_Form_History.student_id",
            "Certificate_Withdrawal_Form.degree",
            "Certificate_Withdrawal_Form.form_type"
         ])
         .orderBy("Certificate_Withdrawal_Form.form_submission_date desc")
         .execute()
         formId = allForms?.map((f:any)=> f?.cf_form_id)
      }
    
    else{
      let lowerRank : any = {
        "certificate_verifier1": "provost",
        "certificate_verifier2": "certificate_verifier1",
        "certificate_section_incharge": "certificate_verifier2",
        "exam_controller":"certificate_section_incharge",
        "vice_chancellor":"exam_controller"
      } 
      const formIDs = await db.selectFrom("Certificate_Form_Verification")
      .innerJoin("Roles", "Roles.user_id", "Certificate_Form_Verification.authority_id")
      .where(({and, eb})=>and([
        eb("Certificate_Form_Verification.status" , "=", "Accepted"),
        eb("Roles.role", "=", lowerRank[role?.role])
      ])).select("Certificate_Form_Verification.form_id")
      .execute()
      formId = formIDs?.map(f => f?.form_id)
  
      if(formId?.length) allForms = await db.selectFrom("Certificate_Form_History")
        .innerJoin("Certificate_Withdrawal_Form", "Certificate_Form_History.cf_form_id", "Certificate_Withdrawal_Form.form_id")
      .where("Certificate_Form_History.cf_form_id", "in", formId)
      .select([
        "Certificate_Form_History.cf_form_id",
        "Certificate_Form_History.student_id",
        "Certificate_Withdrawal_Form.degree",
        "Certificate_Withdrawal_Form.form_type"
     ])
     .orderBy("Certificate_Withdrawal_Form.form_submission_date desc")
     .execute()
    }
  
    var verification : any = []

  
    if(formId?.length > 0) 
        verification = await db.selectFrom("Certificate_Form_Verification")
        .where("Certificate_Form_Verification.authority_id", "=", userID)
        .select([
        "Certificate_Form_Verification.form_id",
        "Certificate_Form_Verification.status"
        ]).execute();
  console.log(verification)

    let formInfo = allForms?.map((f:any) => {
      return {
        ...f,
        verificationUpdate: <any> "Pending"
      }
    })

if(verification?.length){
    verification.forEach((v : any) => {
        formInfo.forEach((f : any, indexF: any)=> {
          if(f?.cf_form_id === v?.form_id )
            formInfo[indexF].verificationUpdate = v?.status
        })
      })
}
const pageLimit = z.coerce.number().parse(req.query.pageLimit || formInfo?.length) ;
const currentPage = z.coerce.number().parse(req.query.currentPage  || 1);
formInfo = certificateDataSplitting(formInfo, pageLimit, currentPage)
if(formInfo) res.status(200).send(formInfo)
  else res.send(404).send({message: "Data not found."})
    }catch(error){
      console.log(error)
      res.status(500).send({message: "Internal server error"})
    }
  })


const verificationData = z.object({
    status: z.string().nullable(),
    authority_id: z.string().nullable(),
    comment: z.string().nullable(),
    form_id: z.number().nullable()
})

certificateWithdrawalOtherStakeholders.post("/add-formStatus/:user_id", async(req, res)=>{
    try{
      const userID = z.coerce.string().parse(req.params.user_id);
      const authorizedRoles = ["provost", "certificate_verifier2", "certificate_verifier1", "certificate_section_incharge", "exam_controller", "vice_chancellor"]
        let role: any = await db.selectFrom("Roles")
        .where(({and, eb}) =>and([
          eb("Roles.user_id", "=",userID),
          eb("Roles.end_date", "is", null)
        ]))
        .select(["Roles.factor", "Roles.role"])
        .executeTakeFirst()
        if(!role || !( authorizedRoles.includes(role?.role?.toLowerCase()))) 
            throw new Error("User not authorized");
      var currentTime = new Date()
      const{
        status,
        authority_id,
        comment,
        form_id
      }= verificationData.parse(req.body)
      await db.insertInto("Certificate_Form_Verification").values({
        verification_date: currentTime,
        status,
        authority_id,
        comment,
        form_id
       }).executeTakeFirst()
       res.status(200).send({
        message: "Data Inserted Successfully.",
      });
    } catch (error) {
      var typeError: z.ZodError | undefined;
      if (error instanceof z.ZodError) {
        typeError = error as z.ZodError;
        return res.status(400).json({
          name: "Invalid data type.",
          message: JSON.parse(typeError.message),
        });
      }
      return res.status(400).json({ message: "Invalid request body", error });
    }
  })


export default certificateWithdrawalOtherStakeholders