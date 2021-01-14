import { Params } from 'mybatis-mapper';

export class meetingDto {
  id: number;
  hostId: number;
  title: string;
  content: string;
  startAt: string;
  endAt: string;
  deadline: string;
  createdAt: string;
  updatedAt: string;
  maxParticipant: number;
  place: string;
  status: number;
  constructor(
    id: number,
    hostId: number,
    title: string,
    content: string,
    startAt: string,
    endAt: string,
    deadline: string,
    createdAt: string,
    updatedAt: string,
    maxParticipant: number,
    place: string,
    status: number,
  ) {
    this.id = id;
    this.hostId = hostId;
    this.title = title;
    this.content = content;
    this.startAt = startAt;
    this.endAt = endAt;
    this.deadline = deadline;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.maxParticipant = maxParticipant;
    this.place = place;
    this.status = status;
  }

  toParam(): Params {
    return {
      id: this.id,
      hostId: this.hostId,
      title: this.title,
      content: this.content,
      startAt: this.startAt,
      endAt: this.endAt,
      deadline: this.deadline,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      maxParticipant: this.maxParticipant,
      place: this.place,
      status: this.status,
    };
  }
}
