import { Router, Request, Response } from 'express';
import meetingService from '../services/meetingService';
import meetingMapper from '../mapper/meetingMapper';
/**
 * @swagger
 * tags:
 *  name: Meeting
 *  description: Meeting CRUD
 * definitions:
 *  meetingPostParam:
 *    type: object
 *    properties:
 *      title:
 *         type: string
 *      content:
 *         type: string
 *      startAt:
 *         type: string
 *      endAt:
 *         type: string
 *      deadline:
 *         type: string
 *      maxParticipant:
 *         type: number
 *      place:
 *         type: string
 */

const router = Router();
const meetingMapperInstance = new meetingMapper();
const meetingServiceInstance = new meetingService(meetingMapperInstance);

/**
 * @swagger
 *  /meeting:
 *    get:
 *      tags:
 *      - Meeting
 *      description: 특정 모임 등록 글의 상세정보를 조회하는 api
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - name: id
 *        type: number
 *        in: query
 *        description: "모임 번호"
 *      responses:
 *       200:
 *        description: board of column list
 *        schema:
 */

router.get('/', async (req: Request, res: Response) => {
  try {
    const id = Number(req.query.id);
    const result = await meetingServiceInstance.getMeeting(id);
    return res.json(result).status(200);
  } catch (error) {
    console.log(error);
    res.send({ Error: error.message }).status(400);
  }
});

/**
 * @swagger
 *  /meeting/list/host:
 *    get:
 *      tags:
 *      - Meeting
 *      description: 특정 호스트의 모임 등록 리스트를 가져온다.
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - name: hostid
 *        type: string
 *        in: query
 *        description: "호스트 ID"
 *      responses:
 *       200:
 *        description: board of column list
 *        schema:
 */
router.get('/list/host', async (req: Request, res: Response) => {
  try {
    const hostId = String(req.query.hostid);
    const hostMeetingList = await meetingServiceInstance.listHostMeetings(hostId);
    res.send(hostMeetingList).status(200);
  } catch (error) {
    console.log(error);
    res.send({ Error: error.message }).status(400);
  }
});

/**
 * @swagger
 *  /meeting/list/all:
 *    get:
 *      tags:
 *      - Meeting
 *      description: 전체 모임글 리스트를 가져온다.
 *      produces:
 *      - applicaion/json
 *      responses:
 *       200:
 *        description: board of all meeting list
 *        schema:
 */
router.get('/list/all', async (req: Request, res: Response) => {
  try {
    const allMeetingList = await meetingServiceInstance.listAllMeetings();
    res.send(allMeetingList).status(200);
  } catch (error) {
    console.log(error);
    res.send({ Error: error.message }).status(400);
  }
});

/**
 * @swagger
 *  /meeting:
 *    post:
 *      tags:
 *      - Meeting
 *      description: 미팅 등록 api
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - in: body
 *        name: hostid
 *        schema:
 *          $ref: '#/definitions/meetingPostParam'
 *      responses:
 *       200:
 *        description: board of column list
 *        schema:
 */

router.post('/', async (req: Request, res: Response) => {
  try {
    const param = req.body;
    const result = await meetingServiceInstance.createMeeting(param);
    return res.json(result).status(201);
  } catch (error) {
    console.log(error);
    res.send({ Error: error.message }).status(400);
  }
});

export default router;
