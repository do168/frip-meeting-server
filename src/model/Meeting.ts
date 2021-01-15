export interface Meeting {
  id: number;
  hostId: string;
  title: string;
  content: string;
  startAt: string;
  endAt: string;
  deadline: string;
  maxParticipant: number;
  place: string;
  updatedAt: string;
  currentParticipant: number;
}
