import { Router, Request, Response } from 'express';
import meetingService from '../services/meetingService';
import meetingMapper from '../mapper/meetingMapper';
/**
 * @swagger
 * tags:
 *  name: Meeting
 *  description: Meeting CRUD
 * definitions:
 *  meetingDto:
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
 *  /post:
 *    post:
 *      tags:
 *      - Meeting
 *      description: 특정 호스트의 모임 등록 리스트를 가져온다.
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - in: body
 *        name: hostid
 *        schema:
 *          $ref: '#/definitions/meetingDto'
 *      responses:
 *       200:
 *        description: board of column list
 *        schema:
 */

router.post('/post', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await meetingServiceInstance.getMeeting(id);
    return res.json(result).status(201);
  } catch (error) {
    console.log(error);
    res.send({ Error: error.message }).status(400);
  }
});

/**
 * @swagger
 *  /list/{hostid}:
 *    get:
 *      tags:
 *      - Meeting
 *      description: 특정 호스트의 모임 등록 리스트를 가져온다.
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - name: hostid
 *        type: number
 *        in: params
 *        description: "호스트 ID"
 *      responses:
 *       200:
 *        description: board of column list
 *        schema:
 */
router.get('/list/:hostid', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const meetingList = await meetingServiceInstance.getHostMeetings(id);
    res.send({ MeetingList: meetingList }).status(200);
  } catch (error) {
    console.log(error);
    res.send({ Error: error.message }).status(400);
  }
});

/**
 * @swagger
 *  /list/{id}:
 *    get:
 *      tags:
 *      - Meeting
 *      description: 특정 모임 등록 글을 가져온다.
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - name: id
 *        type: number
 *        in: params
 *        description: "모임 번호"
 *      responses:
 *       200:
 *        description: board of column list
 *        schema:
 */
router.get('/list/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await meetingServiceInstance.getMeeting(id);
    return res.json(result).status(200);
  } catch (error) {
    console.log(error);
    res.send({ Error: error.message }).status(400);
  }
});

/**
 * @swagger
 *  /listAll:
 *    get:
 *      tags:
 *      - Meeting
 *      description: 전체 모임 등록 글 리스트를 가져온다.
 *      produces:
 *      - applicaion/json
 *      responses:
 *       200:
 *        description: board of all meeting list
 *        schema:
 */
router.get('/listAll', async (req: Request, res: Response) => {
  try {
    const result = await meetingServiceInstance.getAllMeetings();
    return res.json(result).status(200);
  } catch (error) {
    console.log(error);
    res.send({ Error: error.message }).status(400);
  }
});

export default router;
