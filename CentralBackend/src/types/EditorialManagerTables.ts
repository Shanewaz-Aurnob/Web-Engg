import { Insertable, Selectable, Updateable } from "kysely";

export interface EManagerAttachmentTable {
  attachment_id: string;
  attachment_name: string;
  attachment_size: number | null;
  attachment_type: string;
  attachment_url: string;
  reviewer_id: number;
  submission_id: string;
}

export interface EManagerFileTable {
  file_id: string;
  file_name: string;
  file_size: number | null;
  file_type: string;
  file_url: string;
  submission_id: string;
}

export interface EManagerReviewTable {
  review_date: Date;
  review_id: string;
  reviewer_id: number;
  submission_id: string;
}

export interface EManagerReviewerAssignedTable {
  assigned_date: Date;
  reviewer_id: number;
  submission_id: string;
}

export interface EManagerSubmissionTable {
  author_id: number;
  initial_submission_id: string | null;
  keywords: string;
  paper_title: string;
  status:
    | "Accepted"
    | "Assigned"
    | "Pending"
    | "Rejected"
    | "Reviewed"
    | "Submitted";
  status_date: Date;
  submission_date: Date;
  submission_id: string;
}

export interface EManagerSubmissionStatusHistoryTable {
  status:
    | "Accepted"
    | "Assigned"
    | "Pending"
    | "Rejected"
    | "Reviewed"
    | "Submitted";
  status_date: Date;
  submission_id: string;
}

export type EManagerAttachment = Selectable<EManagerAttachmentTable>;
export type NewEManagerAttachment = Insertable<EManagerAttachmentTable>;
export type EManagerAttachmentUpdate = Updateable<EManagerAttachmentTable>;

export type EManagerFile = Selectable<EManagerFileTable>;
export type NewEManagerFile = Insertable<EManagerFileTable>;
export type EManagerFileUpdate = Updateable<EManagerFileTable>;

export type EManagerReview = Selectable<EManagerReviewTable>;
export type NewEManagerReview = Insertable<EManagerReviewTable>;
export type EManagerReviewUpdate = Updateable<EManagerReviewTable>;

export type EManagerReviewerAssigned =
  Selectable<EManagerReviewerAssignedTable>;
export type NewEManagerReviewerAssigned =
  Insertable<EManagerReviewerAssignedTable>;
export type EManagerReviewerAssignedUpdate =
  Updateable<EManagerReviewerAssignedTable>;

export type EManagerSubmission = Selectable<EManagerSubmissionTable>;
export type NewEManagerSubmission = Insertable<EManagerSubmissionTable>;
export type EManagerSubmissionUpdate = Updateable<EManagerSubmissionTable>;

export type EManagerSubmissionStatusHistory =
  Selectable<EManagerSubmissionStatusHistoryTable>;
export type NewEManagerSubmissionStatusHistory =
  Insertable<EManagerSubmissionStatusHistoryTable>;
export type EManagerSubmissionStatusHistoryUpdate =
  Updateable<EManagerSubmissionStatusHistoryTable>;
