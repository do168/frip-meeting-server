export interface meetingPostParam {
  title: string;
  content: string;
  startAt: Date;
  endAt: Date;
  deadline: Date;
  maxParticipant: number;
  place: string;
}
