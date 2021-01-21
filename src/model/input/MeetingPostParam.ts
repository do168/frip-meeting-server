// 모임 등록 parameter 인터페이스
export interface MeetingPostParam {
  hostId: string;
  title: string;
  content: string;
  startAt: string;
  endAt: string;
  deadline: string;
  maxParticipant: number;
  place: string;
}
