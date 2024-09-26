import {
    ColumnType,
    Generated,
    Insertable,
    JSONColumnType,
    Selectable,
    Updateable,
  } from "kysely";


  export interface CertificateFormHistory {
    academic_session : string | null;
    cf_form_id: number | null;
    cf_history_id: Generated<number>;
    degree: string | null;
    department_name: string | null;
    district: string | null;
    father_name_bn: string | null;
    father_name_eng: string | null;
    fifth_year_exam_actual_year: string | null;
    fifth_year_exam_cgpa: number | null;
    fifth_year_exam_name: string | null;
    fifth_year_exam_time: string | null;
    fir_year_exam_actual_year: string | null;
    fir_year_exam_cgpa: number | null;
    fir_year_exam_name: string | null;
    fir_year_exam_time: string | null;
    fourth_year_exam_actual_year: string | null;
    fourth_year_exam_cgpa: number | null;
    fourth_year_exam_name: string | null;
    fourth_year_exam_time: string | null;
    hall_name: string | null;
    mobile_phone: string | null;
    mother_name_bn: string | null;
    mother_name_eng: string | null;
    post_office: string | null;
    present_address: string | null;
    profile_image: string | null;
    sec_year_exam_actual_year: string | null;
    sec_year_exam_cgpa: number | null;
    sec_year_exam_name: string | null;
    sec_year_exam_time: string | null;
    student_id: number | null;
    student_name_bn: string | null;
    student_name_eng: string | null;
    thana: string | null;
    third_year_exam_actual_year: string | null;
    third_year_exam_cgpa: number | null;
    third_year_exam_name: string | null;
    third_year_exam_time: string | null;
    village: string | null;
  }

  export interface CertificateFormVerification {
    authority_id: string | null;
    comment: string | null;
    form_id: number | null;
    status: string | null;
    verification_date: Date | null;
    verification_id: Generated<number>;
  }
  
  export interface CertificateWithdrawalAttachments {
    attachment: string | null;
    attachment_id: Generated<number>;
    form_id: number | null;
    attachment_name: string | null;
  }
  
  export interface CertificateWithdrawalForm {
    degree: string | null;
    form_id: Generated<number>;
    form_submission_date: Date | null;
    form_type: string | null;
    money: number | null;
    payorder_id: string | null;
    student_id: number | null;
  }

export type certificateHistory = Selectable<CertificateFormHistory>;
export type newCertificateHistory = Insertable<CertificateFormHistory>;
export type updateCertificateHistory = Updateable<CertificateFormHistory>;

export type formVerification = Selectable<CertificateFormVerification>;
export type newFormVerification = Insertable<CertificateFormVerification>;
export type updateFormVerification = Updateable<CertificateFormVerification>;

export type formAttachments = Selectable<CertificateWithdrawalAttachments>;
export type newFormAttachments = Insertable<CertificateWithdrawalAttachments>;
export type updateFormAttachments = Updateable<CertificateWithdrawalAttachments>;