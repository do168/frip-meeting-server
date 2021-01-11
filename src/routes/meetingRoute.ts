import { Router, Request, Response } from "express";
import meetingService from "../services/meetingService";
import meetingMapper from "../mapper/meetingMapper";
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
 *  /meetings:
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

router.get("/", async (req: Request, res: Response) => {
	try {
		const allMeetingList = await meetingServiceInstance.listMeetings();
		res.send(allMeetingList).status(200);
	} catch (error) {
		console.log(error);
		res.send({ Error: error.message }).status(400);
	}
});

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
 *        description: board of column list
 *        schema:
 */

router.get("/:id", async (req: Request, res: Response) => {
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
 *  /meetings/{hostId}:
 *    get:
 *      tags:
 *      - Meeting
 *      description: 특정 호스트의 모임 등록 리스트를 가져온다.
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - name: hostId
 *        type: string
 *        in: path
 *        description: "호스트 ID"
 *      responses:
 *       200:
 *        description: board of the host's meeting list
 *        schema:
 */
router.get("/:hostId", async (req: Request, res: Response) => {
	try {
		const hostId = String(req.params.hostId);
		const hostMeetingList = await meetingServiceInstance.listHostMeetings(
			hostId
		);
		res.send(hostMeetingList).status(200);
	} catch (error) {
		console.log(error);
		res.send({ Error: error.message }).status(400);
	}
});

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
 *        description: board of column list
 *        schema:
 */

router.post("/", async (req: Request, res: Response) => {
	try {
		const param = req.body;
		const result = await meetingServiceInstance.createMeeting(param);
		return res.json(result).status(201);
	} catch (error) {
		console.log(error);
		res.send({ Error: error.message }).status(400);
	}
});

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
 *        schema:
 */

router.delete("/:id", async (req: Request, res: Response) => {
	try {
		const param = Number(req.params.id);
		const result = await meetingServiceInstance.deleteMeeting(param);
		return res.json(result).status(201);
	} catch (error) {
		console.log(error);
		res.send({ Error: error.message }).status(400);
	}
});

export default router;
