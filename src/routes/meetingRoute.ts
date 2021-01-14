import { Router, Request, Response, NextFunction } from 'express';
import { wrap } from './wrap';
import meetingService from '../services/meetingService';
import meetingMapper from '../mapper/meetingMapper';
import ServiceUtil from '../util/serviceUtil';
import { MeetingPostParam } from '../model/input/MeetingPostParam';
/**
 * @swagger
 * tags:
 *  name: Meeting
 *  description: Meeting CRUD
 * definitions:
 *  MeetingPostParam:
 *    type: object
 *    properties:
 *      hostId:
 *        type: string
 *      title:
 *        type: string
 *      content:
 *        type: string
 *      startAt:
 *        type: string
 *      endAt:
 *        type: string
 *      deadline:
 *        type: string
 *      maxParticipant:
 *        type: number
 *      place:
 *        type: string
 */

const router = Router();
// DI
const serviceUtilInstance = new ServiceUtil();
const meetingMapperInstance = new meetingMapper(serviceUtilInstance);
const meetingServiceInstance = new meetingService(meetingMapperInstance, serviceUtilInstance);

/**
 * @swagger
 *  /meetings:
 *    get:
 *      tags:
 *      - Meeting
 *      description: 전체 모임글 리스트를 가져온다. query에 host를 추가해 host별 미팅 모임글 리스트를 가져올 수 있다.
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - name: pageNum
 *        type: number
 *        in: query
 *        description: "페이지 번호"
 *        required: true
 *      - name: hostId
 *        type: string
 *        in: query
 *        description: "호스트 ID"
 *      responses:
 *       200:
 *        description: board of meeting list
 */

router.get(
  '/',
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const hostId = String(req.query.hostId);
    const pageNum = Number(req.query.pageNum);
    const result = await meetingServiceInstance.listMeetings(hostId, pageNum);
    res.json({ result });
  }),
);

/**
 * @swagger
 *  /meetings/{id}:
 *    get:
 *      tags:
 *      - Meeting
 *      description: 특정 모임 등록 글의 상세정보를 조회하는 api
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - name: id
 *        type: number
 *        in: path
 *        description: "모임 번호"
 *      responses:
 *       200:
 *        description: data of the meetingId
 */

router.get(
  '/:id',
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const result = await meetingServiceInstance.getMeeting(id);
    return res.json({ result });
  }),
);

/**
 * @swagger
 *  /meetings:
 *    post:
 *      tags:
 *      - Meeting
 *      description: 미팅 등록 api
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - in: body
 *        name: Meeting
 *        schema:
 *          $ref: '#/definitions/MeetingPostParam'
 *      responses:
 *       200:
 */

router.post(
  '/',
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const meetingInfo = req.body as MeetingPostParam;
    const result = await meetingServiceInstance.createMeeting(meetingInfo);
    return res.status(201).json({ result });
  }),
);

/**
 * @swagger
 *  /meetings/{id}:
 *    delete:
 *      tags:
 *      - Meeting
 *      description: 미팅 삭제 api
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - name: id
 *        type: number
 *        in: path
 *        description: "미팅 ID"
 *      responses:
 *       200:
 *        description: soft delete success
 */

router.delete(
  '/:id',
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const result = await meetingServiceInstance.deleteMeeting(id);
    return res.json({ result });
  }),
);

/**
 * @swagger
 *  /meetings/{id}:
 *    put:
 *      tags:
 *      - Meeting
 *      description: 미팅 수정 api
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - in: path
 *        name: id
 *        type: number
 *        description: "미팅 ID"
 *      - in: body
 *        name: Meeting
 *        schema:
 *          $ref: '#/definitions/MeetingPostParam'
 *      responses:
 *       200:
 */

router.put(
  '/:id',
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const meetingInfo = req.body as MeetingPostParam;
    const result = await meetingServiceInstance.updateMeeting(id, meetingInfo);
    return res.json({ result });
  }),
);

/**
 * @swagger
 *  /meetings/{id}/users:
 *    post:
 *      tags:
 *      - Meeting
 *      description: 미팅 참가 신청 api - maxParticipation보다 신청한 인원 수가 적거나 deadline 전까지만 신청 가능하다
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - in: path
 *        name: userId
 *        type: number
 *        description: "미팅 ID"
 *      - name: userId
 *        in: body
 *        description: "참가 신청 유저 ID"
 *        schema:
 *          type: object
 *          properties:
 *            userId:
 *              type: string
 *        required: true
 *      responses:
 *       200:
 */

router.post(
  '/:id/users',
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const userId = req.body.userId;
    const result = await meetingServiceInstance.createMeetingParticipation(id, userId);
    return res.status(201).json({ result });
  }),
);

/**
 * @swagger
 *  /meetings/{id}/users/{userId}:
 *    delete:
 *      tags:
 *      - Meeting
 *      description: 미팅 참가 신청 취소 api - deadline 전까지만 취소 가능하다.
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - in: path
 *        name: id
 *        type: number
 *        description: "미팅 ID"
 *      - in: path
 *        name: userId
 *        type: string
 *        description: "참가 신청 유저 ID"
 *      responses:
 *       200:
 *        description: soft delete success
 */

router.delete(
  '/:id/users/:userId',
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const userId = String(req.params.userId);
    const result = await meetingServiceInstance.deleteMeetingParticipation(id, userId);
    return res.json({ result });
  }),
);

/**
 * @swagger
 *  /meetings/{id}/users/{userId}:
 *    put:
 *      tags:
 *      - Meeting
 *      description: 출석 체크 api - 모임 startAt 30분 후부터 가능하다.
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - in: path
 *        name: id
 *        type: number
 *        description: "미팅 ID"
 *      - in: path
 *        name: userId
 *        type: string
 *        description: "참가 신청 유저 ID"
 *      responses:
 *       200:
 *        description: soft delete success
 */
router.put(
  '/:id/users/:userId',
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const userId = String(req.params.userId);
    const result = await meetingServiceInstance.updateMeetingAttendance(id, userId);
    return res.json({ result });
  }),
);

export default router;
