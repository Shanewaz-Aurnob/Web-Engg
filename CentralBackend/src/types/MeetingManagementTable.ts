import { Generated, Insertable, Selectable, Updateable } from "kysely";



// Meeting Table
export interface MeetingTable {
  meeting_id: Generated<number>;
  meeting_type_id: number | null;
  meeting_room_id: number | null;
  meeting_agenda_id: number | null;
  department_id: number | null;
  meeting_time: Date | null;
  pdf_url: string | null;
  signature_url:string | null
}

export type Meeting = Selectable<MeetingTable>;
export type NewMeeting = Insertable<MeetingTable>;
export type MeetingUpdate = Updateable<MeetingTable>;

// Meeting Agenda Table
export interface MeetingAgendaTable {
  meeting_agenda_id: Generated<number>;
  topic: string | null;
  description: string | null;
  decision: string | null;
  meeting_id:number |  null ;
}

export type MeetingAgenda = Selectable<MeetingAgendaTable>;
export type NewMeetingAgenda = Insertable<MeetingAgendaTable>;
export type MeetingAgendaUpdate = Updateable<MeetingAgendaTable>;

// Meeting Attend Table
export interface MeetingAttendTable {
  user_id: string | null;
  meeting_id: number | null;
}

export type MeetingAttend = Selectable<MeetingAttendTable>;
export type NewMeetingAttend = Insertable<MeetingAttendTable>;
export type MeetingAttendUpdate = Updateable<MeetingAttendTable>;

// Meeting Room Table
export interface MeetingRoomTable {
  meeting_room_id: Generated<number>;
  room_name: string | null;
}

export type MeetingRoom = Selectable<MeetingRoomTable>;
export type NewMeetingRoom = Insertable<MeetingRoomTable>;
export type MeetingRoomUpdate = Updateable<MeetingRoomTable>;

// Meeting Type Table
export interface MeetingTypeTable {
  meeting_type_id: Generated<number>;
  meeting_type: string | null;
}

export type MeetingType = Selectable<MeetingTypeTable>;
export type NewMeetingType = Insertable<MeetingTypeTable>;
export type MeetingTypeUpdate = Updateable<MeetingTypeTable>;


