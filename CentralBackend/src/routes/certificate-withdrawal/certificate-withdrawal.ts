import express, { Request, Response } from "express";
import db, {Database, TableName} from "../../database"
import {z} from "zod"
import { SelectQueryBuilder } from "kysely";
import { paginatedResults } from "../../helper/paginatedResults";
import { CertificateWithdrawalAttachments } from "../../types/CertificateWithdrawalTables";
import { certificateDataSplitting } from "./certificate-data-splitting";


const certificateWithdrawal = express.Router();

certificateWithdrawal.get("/", async(req, res)=>{
    try{
        const user_id = z.coerce.string().parse(req.query.user_id);
        const program_abbr = z.coerce.string().parse(req.query.program_abbr);
        var userInfo = await db.selectFrom("User")
        .innerJoin("Student", "User.user_id", "Student.user_id")
        .innerJoin("Hall", "Hall.hall_id", "Student.hall_id")
        .innerJoin("Department", "Department.department_id", "Student.department_id")
        .innerJoin("Program", "Program.program_id", "Student.program_id")
        .selectAll()
        .where("User.user_id", "=", user_id)
        .execute()

        var presentAddress = await db.selectFrom("Address")
        .where("Address.address_id", "=", userInfo[0]?.present_address_id)
        .selectAll()
        .execute()

        var permanentAddress = await db.selectFrom("Address")
        .where("Address.address_id", "=", userInfo[0]?.permanent_address_id).selectAll()
        .execute();


        var session = userInfo[0]?.academic_session_id?.toString().slice(0,4);
        var session1 = (Number(session?.slice(2,4)) + 1)
        const academic_session = session + "-" + session1

        // var academic_sessions = await db.selectFrom("Academic_Session")
        // .select("Academic_Session.academic_session_id")
        // .where("Academic_Session.session", "=", academic_session)
        // .execute();
        // const temp = academic_sessions?.map(a => a?.academic_session_id)

        var results = await db.selectFrom("Semester_Result")
        .innerJoin("Exam", "Exam.academic_session_id", "Semester_Result.academic_session_id")
        .innerJoin("Academic_Session", "Academic_Session.academic_session_id", "Semester_Result.academic_session_id")
        .innerJoin("Program", "Program.program_id", "Academic_Session.program_id")
        .where(({and, eb})=> and([
          // eb("Semester_Result.academic_session_id", "in", temp), 
          eb("Semester_Result.student_id", "=", userInfo[0]?.student_id),
          eb("Program.program_abbr", "=", program_abbr)
          // eb("Semester_Result.academic_session_id", "=", "Academic_Session.academic_session_id")
          // eb("Exam.department_id", "=", userInfo[0]?.department_id),
          // eb("Exam.academic_session_id", "in", temp)
        ]))
        .selectAll().execute()
        // .select(["Exam.academic_session_id",
        //    "Exam.exam_centre", 
        //    "Semester_Result.cgpa", 
        //    "Academic_Session.session",
        //    "Exam.exam_start_date", 
        //    "Exam.exam_end_date", 
        //    "Exam.exam_name"])
        // .execute()

        var profileImage = await db.selectFrom("Image").select(["Image.image_path"])
        .where("Image.image_id", "=", userInfo[0]?.profile_image_id).execute()

        var signImage = await db.selectFrom("Image").select(["Image.image_path"])
        .where("Image.image_id", "=", userInfo[0]?.sign_id).execute()
        var data = {
            ...userInfo[0],
            profile_image: profileImage[0]?.image_path || null,
            sign_image: signImage[0]?.image_path || null,
            results: results,
            presentAddress: presentAddress,
            permanentAddress: permanentAddress,
            academic_session: academic_session
        }
        if(userInfo?.length) res.status(200).json(data)
        else res.status(404).json({message: "User not found"}) 
    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Internal server error", error });
    }
})


const formHistoryBody = z.object ({
    academic_session: z.string().nullable(),
    file_attachments: z.array(
      z.object({
        attachment_name: z.string().nullable(),
        attachment: z.string().nullable()
      })
    ).nullable(),
    form_type: z.string().nullable(),
    money: z.number().nullable(),
    payorder_id: z.string().nullable(),
    degree: z.string().nullable(),
    district:z.string().nullable(),
    father_name_bn: z.string().nullable(),
    father_name_eng: z.string().nullable(),
    fifth_year_exam_actual_year: z.string().nullable(),
    fifth_year_exam_cgpa: z.number().nullable(),
    fifth_year_exam_name: z.string().nullable(),
    fifth_year_exam_time: z.string().nullable(),
    fir_year_exam_actual_year: z.string().nullable(),
    fir_year_exam_cgpa: z.number().nullable(),
    fir_year_exam_name: z.string().nullable(),
    fir_year_exam_time: z.string().nullable(),
    fourth_year_exam_actual_year: z.string().nullable(),
    fourth_year_exam_cgpa: z.number().nullable(),
    fourth_year_exam_name: z.string().nullable(),
    fourth_year_exam_time: z.string().nullable(),
    hall_name: z.string().nullable(),
    mobile_phone: z.string().nullable(),
    mother_name_bn: z.string().nullable(),
    mother_name_eng: z.string().nullable(),
    post_office: z.string().nullable(),
    present_address: z.string().nullable(),
    profile_image: z.string().nullable(),
    sec_year_exam_actual_year: z.string().nullable(),
    sec_year_exam_cgpa: z.number().nullable(),
    sec_year_exam_name: z.string().nullable(),
    sec_year_exam_time: z.string().nullable(),
    student_id: z.number().nullable(),
    student_name_bn: z.string().nullable(),
    student_name_eng: z.string().nullable(),
    thana: z.string().nullable(),
    third_year_exam_actual_year: z.string().nullable(),
    third_year_exam_cgpa: z.number().nullable(),
    third_year_exam_name: z.string().nullable(),
    third_year_exam_time: z.string().nullable(),
    village: z.string().nullable(),
})

certificateWithdrawal.post("/post-form", async(req, res)=>{

try{
    var currentTime = new Date()
    const 
    {
    file_attachments,
    academic_session,
    form_type,
    money,
    payorder_id,
    degree,
    district,
    father_name_bn,
    father_name_eng,
    fifth_year_exam_actual_year,
    fifth_year_exam_cgpa,
    fifth_year_exam_name,
    fifth_year_exam_time,
    fir_year_exam_actual_year,
    fir_year_exam_cgpa,
    fir_year_exam_name,
    fir_year_exam_time,
    fourth_year_exam_actual_year,
    fourth_year_exam_cgpa,
    fourth_year_exam_name,
    fourth_year_exam_time,
    hall_name,
    mobile_phone,
    mother_name_bn,
    mother_name_eng,
    post_office,
    present_address,
    profile_image,
    sec_year_exam_actual_year,
    sec_year_exam_cgpa,
    sec_year_exam_name,
    sec_year_exam_time,
    student_id,
    student_name_bn,
    student_name_eng,
    thana,
    third_year_exam_actual_year,
    third_year_exam_cgpa,
    third_year_exam_name,
    third_year_exam_time,
    village
} = formHistoryBody.parse(req?.body)

const result = await db.insertInto("Certificate_Withdrawal_Form").values({
     form_type,
     payorder_id,
     form_submission_date: currentTime,
     money,
     degree,
     student_id
    }).executeTakeFirst()
    await db.insertInto("Certificate_Form_History").values({
        cf_form_id: Number(result?.insertId),
        academic_session: academic_session,
        degree : degree,
        district: district,
        father_name_bn: father_name_bn,
        father_name_eng: father_name_eng,
        fifth_year_exam_actual_year: fifth_year_exam_actual_year,
        fifth_year_exam_cgpa: fifth_year_exam_cgpa,
        fifth_year_exam_name: fifth_year_exam_name,
        fifth_year_exam_time: fifth_year_exam_time,
        fir_year_exam_actual_year : fir_year_exam_actual_year,
        fir_year_exam_cgpa: fir_year_exam_cgpa,
        fir_year_exam_name: fir_year_exam_name,
        fir_year_exam_time: fir_year_exam_time,
        fourth_year_exam_actual_year: fourth_year_exam_actual_year,
        fourth_year_exam_cgpa: fourth_year_exam_cgpa,
        fourth_year_exam_name: fourth_year_exam_name,
        fourth_year_exam_time: fourth_year_exam_time,
        hall_name: hall_name,
        mobile_phone: mobile_phone,
        mother_name_bn: mother_name_bn,
        mother_name_eng: mother_name_eng,
        post_office: post_office,
        present_address: present_address,
        profile_image: profile_image,
        sec_year_exam_actual_year: sec_year_exam_actual_year,
        sec_year_exam_cgpa: sec_year_exam_cgpa,
        sec_year_exam_name: sec_year_exam_name,
        sec_year_exam_time: sec_year_exam_time,
        student_id: student_id,
        student_name_bn: student_name_bn,
        student_name_eng: student_name_eng,
        thana: thana,
        third_year_exam_actual_year: third_year_exam_actual_year,
        third_year_exam_cgpa: third_year_exam_cgpa,
        third_year_exam_name: third_year_exam_name,
        third_year_exam_time: third_year_exam_time,
        village: village
    }).executeTakeFirst()
  
   let  attachments = 
    file_attachments?.map(fa => {
      return {
        ...fa,
        form_id:Number(result?.insertId), 
      }
    }) || []
    await db.insertInto("Certificate_Withdrawal_Attachments").values(attachments).execute()
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

certificateWithdrawal.get("/search-formData/:user_id", async(req, res)=>{
 try{
  const user_id  = z.coerce.string().parse(req.params.user_id);
  var student_id:any = await db
  .selectFrom("Student").where("Student.user_id", "=", user_id)
  .select("Student.student_id").executeTakeFirst();
  console.log(student_id?.student_id)
  var formInfo = await db.selectFrom("Certificate_Withdrawal_Form")
  .innerJoin("Certificate_Form_History", "Certificate_Form_History.cf_form_id", "Certificate_Withdrawal_Form.form_id")
  .where("Certificate_Withdrawal_Form.student_id", "=", student_id?.student_id).selectAll().execute()

  var formId = formInfo?.map(f => f?.form_id)
  var attachments = await db.selectFrom("Certificate_Withdrawal_Attachments")
  .where("Certificate_Withdrawal_Attachments.form_id", "in", formId).selectAll().execute()

  var verifications = await db.selectFrom("Certificate_Form_Verification")
  .innerJoin("Roles", "Certificate_Form_Verification.authority_id", "Roles.user_id")
  .where("Certificate_Form_Verification.form_id", "in", formId).select([
    "Certificate_Form_Verification.status",
    "Certificate_Form_Verification.comment",
    "Certificate_Form_Verification.form_id",
    "Certificate_Form_Verification.verification_date",
    "Roles.role"
  ])
  .execute()
  let modFormInfo : any = formInfo?.map(f => {
    return {
      ...f,
      verifications: <any>[],
      attachments: <any>[]
    }
  })
  verifications.forEach(v => {
    modFormInfo.forEach((f:any, indexF: any)=> {
      if(f?.form_id === v?.form_id)
        modFormInfo[indexF]?.verifications?.push(v)
    })
  })
  attachments.forEach(a => {           
    modFormInfo.forEach((f: any, indexF: any)=> {
      if(f?.form_id === a?.form_id)
        modFormInfo[indexF]?.attachments?.push(a)
    })
  })
  const pageLimit = z.coerce.number().parse(req.query.pageLimit || modFormInfo?.length) ;
  const currentPage = z.coerce.number().parse(req.query.currentPage  || 1);
  modFormInfo = certificateDataSplitting(modFormInfo, pageLimit, currentPage)
  if(formInfo?.length) res.status(200).json(modFormInfo)
    else res.status(404).json({message: "User not found"}) 
 }catch(error){
  console.log(error);
  res.status(500).json({ message: "Internal server error", error });
 }

})


certificateWithdrawal.get("/search-formData/other-stakeholders/:user_id", async(req, res)=>{
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
      ) throw new Error("User not authorized");
    let {factor} = role
    let allForms: any=[]
    let formId: any =[]
    if(role?.role?.toLowerCase() === "provost"){
       factor = factor?.split("_")
       let hallName = factor?.map((f: any)  => f[0].toUpperCase()+f.slice(1,).toLowerCase()).join(" ")
       
        allForms = await db.selectFrom("Certificate_Form_History")
       .where(({and, eb})=>and([
        eb("Certificate_Form_History.hall_name", "=", hallName),
       ])).selectAll().execute()
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

    if(formId?.length) allForms = await db.selectFrom("Certificate_Form_History").where(
      "Certificate_Form_History.cf_form_id", "in", formId
    ).selectAll().execute()
  }

  var attachments: any = []
  var verifications : any = []
  var verification : any = []
  if(formId?.length > 0) attachments = await db.selectFrom("Certificate_Withdrawal_Attachments")
  .where("Certificate_Withdrawal_Attachments.form_id", "in", formId).selectAll().execute()

  if(formId?.length > 0) verification = await db.selectFrom("Certificate_Form_Verification")
    .where("Certificate_Form_Verification.form_id", "in", formId).selectAll().execute();
// console.log(verification)
  verification.forEach((v: any)=>{
    console.log(v?.authority_id, userID)
    if(v?.authority_id === userID)
      verifications?.push(v)
  })
    // console.log(verifications)
  const formInfo = allForms?.map((f:any) => {
    return {
      ...f,
      attachments: <any>[],
      verifications: <any>[]
    }
  })
  attachments.forEach((a: any) => {           
    formInfo.forEach((f: any, indexF: any)=> {
      if(f?.cf_form_id === a?.form_id)
        formInfo[indexF]?.attachments?.push(a)
    })
  })
  verifications.forEach((v : any) => {
    formInfo.forEach((f : any, indexF: any)=> {
      console.log(v?.form_id, f?.form_id)
      if(f?.cf_form_id === v?.form_id)
        formInfo[indexF]?.verifications?.push(v)
    })
  })
  // console.log(formInfo)
  res.status(200).send(formInfo)
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
certificateWithdrawal.post("/add-formStatus/other-stakeholders", async(req, res)=>{
  try{
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

export default certificateWithdrawal 