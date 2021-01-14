import { Router, Request, Response, NextFunction } from 'express';
import { wrap } from './wrap';
import meetingService from '../services/meetingService';
import meetingMapper from '../mapper/meetingMapper';
import serviceUtil from '../util/serviceUtil';
import { MeetingPostParam } from '../model/input/MeetingPostParam';
/**
 * @swagger
 * tags:
 *  name: Meeting
 *  description: Meeting CRUD
 * definitions:
 *  meetingPostParam:
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
const serviceUtilInstance = new serviceUtil();
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
    const pageNum = req.query.pageNum ? Number(req.query.pageNum) : 1;
    const result = await meetingServiceInstance.listMeetings(hostId, pageNum);
    res.status(result.status).send(result.message);
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
    return res.status(result.status).json(result.message);
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
 *        name: meetingPostParam
 *        schema:
 *          $ref: '#/definitions/meetingPostParam'
 *      responses:
 *       200:
 */

router.post(
  '/',
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const meetingInfo = req.body as MeetingPostParam;
    const result = await meetingServiceInstance.createMeeting(meetingInfo);
    return res.status(result.status).json(result.message);
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
    return res.status(result.status).json(result.message);
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
 *        name: meetingPostParam
 *        schema:
 *          $ref: '#/definitions/meetingPostParam'
 *      responses:
 *       200:
 */

router.put(
  '/:id',
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const meetingInfo = req.body as MeetingPostParam;
    const result = await meetingServiceInstance.updateMeeting(id, meetingInfo);
    return res.status(result.status).json(result.message);
  }),
);

/**
 * @swagger
 *  /meetings/{id}/participations:
 *    post:
 *      tags:
 *      - Meeting
 *      description: 미팅 참가 신청 api
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - in: path
 *        name: id
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
  '/:id/participations',
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const userId = req.body.userId;
    const result = await meetingServiceInstance.createMeetingParticipation(id, userId);
    return res.status(result.status).json(result.message);
  }),
);

/**
 * @swagger
 *  /meetings/{id}/participations/{participatios_id}:
 *    delete:
 *      tags:
 *      - Meeting
 *      description: 미팅 참가 신청 취소 api
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - in: path
 *        name: id
 *        type: number
 *        description: "미팅 ID"
 *      - in: path
 *        name: participation_id
 *        type: number
 *        description: "참가 신청 ID"
 *      - in: query
 *        name: user_id
 *        type: string
 *        description: "참가 신청 유저 ID"
 *      responses:
 *       200:
 *        description: soft delete success
 */

router.delete(
  '/:id/participations/{participation_id}',
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const participationId = Number(req.params.participation_id);
    const userId = String(req.query.user_id);
    const result = await meetingServiceInstance.deleteMeetingParticipation(participationId, userId);
    return res.status(result.status).json(result.message);
  }),
);

export default router;
