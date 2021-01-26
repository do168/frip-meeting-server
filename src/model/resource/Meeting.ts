export interface Meeting {
  id: number;
  hostId: string;
  title: string;
  content: string;
  startAt: Date;
  endAt: Date;
  deadline: Date;
  maxParticipant: number;
  place: string;
  updatedAt: Date;
  cntCurrentParticipant: number;
}
