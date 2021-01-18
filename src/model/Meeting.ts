export interface Meeting {
  hostId: string;
  title: string;
  content: string;
  startAt: Date;
  endAt: Date;
  deadline: Date;
  maxParticipant: number;
  place: string;
  updatedAt: Date;
  currentParticipant: number;
}
