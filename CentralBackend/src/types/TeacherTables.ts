import { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface EducationTable {
    education_country: string;
    education_from_year: string;
    education_institution: string;
    education_title: string;
    education_to_year: string;
    user_id: string;
  }
  
  export interface ProfessionalExperineceTable {
    professional_experience_country: string;
    professional_experience_description: string;
    professional_experience_institution: string;
    professional_experience_title: string;
    professional_experience_year: string;
    teacher_id: number;
  }
  
  export interface AdministrativeExperineceTable {
    administrative_experinece_description: string;
    administrative_experinece_institution: string;
    administrative_experinece_title: string;
    administrative_experinece_year: string;
    teacher_id: number;
  }
  
  export interface ScholarshipAndFellowshipTable {
    scholarship_country: string;
    scholarship_degree: string;
    scholarship_from_year: string;
    scholarship_institution: string;
    scholarship_title: string;
    scholarship_to_year: string;
    teacher_id: number;
  }
  
  export interface AccomplishmentTable {
    acomplishment_field: string;
    acomplishment_organization: string;
    acomplishment_title: string;
    acomplishment_year: string;
    teacher_id: number;
  }
  
  export interface TrainingAndCertificationTable {
    teacher_id: number;
    training_duration: string;
    training_field: string;
    training_title: string;
    training_year: string;
  }
  
  export interface JournalTable {
    journal_title: string;
    journal_type: string;
    journal_year: string;
    teacher_id: number;
  }
  
  export interface PublicationTable {
    publication_description: string;
    publication_field: string;
    publication_title: string;
    publication_year: string;
    teacher_id: number;
  }
  
  export interface AwardTable {
    award_country: string;
    award_institution: string;
    award_title: string;
    award_year: string;
    teacher_id: number;
  }

export type Education = Selectable<EducationTable>;
export type NewEducation = Insertable<EducationTable>;
export type EducationUpdate = Updateable<EducationTable>;

export type ProfessionalExperinece = Selectable<ProfessionalExperineceTable>;
export type NewProfessionalExperinece = Insertable<ProfessionalExperineceTable>;
export type ProfessionalExperineceUpdate = Updateable<ProfessionalExperineceTable>;

export type AdministrativeExperinece = Selectable<AdministrativeExperineceTable>;
export type NewAdministrativeExperinece = Insertable<AdministrativeExperineceTable>;
export type AdministrativeExperineceUpdate = Updateable<AdministrativeExperineceTable>;

export type ScholarshipAndFellowship = Selectable<ScholarshipAndFellowshipTable>;
export type NewScholarshipAndFellowship = Insertable<ScholarshipAndFellowshipTable>;
export type ScholarshipAndFellowshipUpdate = Updateable<ScholarshipAndFellowshipTable>;

export type Accomplishment = Selectable<AccomplishmentTable>;
export type NewAccomplishment = Insertable<AccomplishmentTable>;
export type AccomplishmentUpdate = Updateable<AccomplishmentTable>;

export type TrainingAndCertification = Selectable<TrainingAndCertificationTable>;
export type NewTrainingAndCertification = Insertable<TrainingAndCertificationTable>;
export type TrainingAndCertificationUpdate = Updateable<TrainingAndCertificationTable>;

export type Journal = Selectable<JournalTable>;
export type NewJournal = Insertable<JournalTable>;
export type JournalUpdate = Updateable<JournalTable>;

export type Publication = Selectable<PublicationTable>;
export type NewPublication = Insertable<PublicationTable>;
export type PublicationUpdate = Updateable<PublicationTable>;

export type Award = Selectable<AwardTable>;
export type NewAward = Insertable<AwardTable>;
export type AwardUpdate = Updateable<AwardTable>;