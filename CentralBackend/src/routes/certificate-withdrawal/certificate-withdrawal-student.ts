import express from "express";
import db from "../../database"
import {z} from "zod"
import { certificateDataSplitting } from "./certificate-data-splitting";

const certificateWithdrawalStudent = express.Router();

certificateWithdrawalStudent.get("/", async(req, res)=>{
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
         
        console.log(userInfo);
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
        .orderBy("Exam.exam_start_date asc")
        // .selectAll().execute()
        .select(["Exam.academic_session_id",
           "Exam.exam_centre", 
           "Semester_Result.cgpa", 
           "Academic_Session.session",
           "Exam.exam_start_date", 
           "Exam.exam_end_date", 
           "Exam.exam_name",
          "Program.program_abbr",
        "Program.program_name",
      "Exam.exam_session",
    "Academic_Session.semester"])
        .execute()

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
  department_name:  z.string().nullable(),
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

certificateWithdrawalStudent.post("/post-form", async(req, res)=>{

try{
    var currentTime = new Date()
    const 
    {
      department_name,
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
        department_name: department_name,
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

certificateWithdrawalStudent.get("/search-formData/:user_id", async(req, res)=>{
 try{
  const user_id  = z.coerce.string().parse(req.params.user_id);
  console.log("userID", user_id)
  var student_id : any = await db
  .selectFrom("Student").where("Student.user_id", "=", user_id)
  .select("Student.student_id").executeTakeFirst();

  var role = await db.selectFrom("Roles")
  .where("Roles.user_id", "=", user_id)
  .select("Roles.role").executeTakeFirst();

  if(role) return res.status(404).json({message: "User unauthorized!"}) 
  
  var formInfo : any = await db.selectFrom("Certificate_Withdrawal_Form")
  .innerJoin("Certificate_Form_History", "Certificate_Form_History.cf_form_id", "Certificate_Withdrawal_Form.form_id")
  .where("Certificate_Withdrawal_Form.student_id", "=", student_id?.student_id)
  .select([
    "Certificate_Withdrawal_Form.form_id", 
    "Certificate_Form_History.degree",
    "Certificate_Form_History.student_id",
    "Certificate_Withdrawal_Form.form_type",
    "Certificate_Withdrawal_Form.form_submission_date"
  ]).orderBy("Certificate_Withdrawal_Form.form_submission_date desc")
  .execute()
  console.log(formInfo)
  const formId = formInfo?.map((f: any) => f?.form_id)
  let verifications = <any> []
 if(formInfo){
  verifications = await db.selectFrom("Certificate_Form_Verification")
  .innerJoin("Roles", "Certificate_Form_Verification.authority_id", "Roles.user_id")
  .orderBy("Certificate_Form_Verification.verification_date desc")
  .where("Certificate_Form_Verification.form_id", "in", formId)
  .select([
    "Certificate_Form_Verification.status",
    "Certificate_Form_Verification.form_id",
    "Roles.role"
  ])
  .execute()
 }

 let modFormInfo : any = formInfo?.map((f: any) => {
    return {
      ...f,
      verificationUpdate: <any> "pending",
      status: <any> ""
    }
  })
  
if(formInfo){
  verifications.forEach((v: any) => {
    formInfo.forEach((f:any, indexF: any)=> {
      if(f?.form_id === v?.form_id && modFormInfo[indexF]?.verificationUpdate === "pending")
      {
        modFormInfo[indexF].verificationUpdate = v?.role;
        modFormInfo[indexF].status = v?.status;     
      }
    })
  })
}

  const pageLimit = z.coerce.number().parse(req.query.pageLimit || formInfo?.length) ;
  const currentPage = z.coerce.number().parse(req.query.currentPage  || 1);
  modFormInfo = certificateDataSplitting(modFormInfo, pageLimit, currentPage)

  if(formInfo) res.status(200).json(modFormInfo)
  else res.status(404).json({message: "Data not found"}) 
 }catch(error){
  console.log(error);
  res.status(500).json({ message: "Internal server error", error });
 }
})

// certificateWithdrawalStudent.get("/see-details/:form_id", async (req, res)=>{
//    try{
//     const form_id  = z.coerce.number().parse(req.params.form_id);

//     const formInfo= await db.selectFrom("Certificate_Withdrawal_Form")
//     .innerJoin("Certificate_Form_History", "Certificate_Form_History.cf_form_id", "Certificate_Withdrawal_Form.form_id")
//     .where("Certificate_Withdrawal_Form.form_id", "=", form_id)
//     .selectAll().execute();

//    const attachments = await db.selectFrom("Certificate_Withdrawal_Attachments")
//   .where("Certificate_Withdrawal_Attachments.form_id", "=", form_id)
//   .select([
//     "Certificate_Withdrawal_Attachments.attachment",
//     "Certificate_Withdrawal_Attachments.attachment_name"
//   ]).execute();

//    const verifications = await db.selectFrom("Certificate_Form_Verification")
//   .innerJoin("Roles", "Certificate_Form_Verification.authority_id", "Roles.user_id")
//   .where("Certificate_Form_Verification.form_id", "=", form_id).select([
//     "Certificate_Form_Verification.status",
//     "Certificate_Form_Verification.comment",
//     "Certificate_Form_Verification.verification_date",
//     "Roles.role"
//   ])
//   .execute()

//     const data= {
//       data: formInfo,
//       attachments: attachments,
//       verifications: verifications,
//     }
//     if(formInfo?.length) 
//         res.status(200).json(data)
//         else res.status(404).json({message: "Data not found"}) 
//    }catch(error){
//       console.log(error);
//       res.status(500).json({ message: "Internal server error", error });
//      }
// })
export default certificateWithdrawalStudent