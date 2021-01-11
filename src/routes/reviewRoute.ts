import { Router, Request, Response } from "express";
import reviewMapper from "../mapper/reviewMapper";
import reviewService from "../services/reviewService";
/**
 * @swagger
 * tags:
 *  name: Review
 *  description: Review CRUD
 * definitions:
 *  reviewPostParam:
 *    type: object
 *    properties:
 *      meetingId:
 *         tyoe: number
 *      title:
 *         type: string
 *      content:
 *         type: string
 */

const router = Router();
const reviewMapperInstance = new reviewMapper();
const reviewServiceInstance = new reviewService(reviewMapperInstance);

/**
 * @swagger
 *  /reviews/{id}:
 *    get:
 *      tags:
 *      - Review
 *      description: 특정 리뷰의 상세 데이터를 조회한다.
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - name: id
 *        type: number
 *        in: path
 *        description: "리뷰 번호"
 *      responses:
 *       200:
 *        description: data of the id_review
 *        schema:
 */

router.get("/:id", async (req: Request, res: Response) => {
	try {
		const id = Number(req.params.id);
		const review = await reviewServiceInstance.getReview(id);
		res.send(review).status(200);
	} catch (error) {
		console.log(error);
		res.send({ Error: error.message }).status(400);
	}
});

/**
 * @swagger
 *  /reviews/{meetingId}:
 *    get:
 *      tags:
 *      - Review
 *      description: 특정 모임의 리뷰 리스트를 가져온다
 *      produces:
 *      - applicaion/json
 *      responses:
 *       200:
 *        description: review list of the meetingId
 *        schema:
 */

router.get("/:meetingId", async (req: Request, res: Response) => {
	try {
		const meetingId = Number(req.params.meetingId);
		const listMeetingReview = await reviewServiceInstance.listMeetingReviews(
			meetingId
		);
		res.send(listMeetingReview).status(200);
	} catch (error) {
		console.log(error);
		res.send({ Error: error.message }).status(400);
	}
});

/**
 * @swagger
 *  /reviews/{userId}:
 *    get:
 *      tags:
 *      - Review
 *      description: 특정 유저의 후기 리스트를 가져온다
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - name: id
 *        type: string
 *        in: path
 *        description: "유저 아이디"
 *      responses:
 *       200:
 *        description: review list of the userId
 *        schema:
 */

router.get("/:userId", async (req: Request, res: Response) => {
	try {
		const id = String(req.params.id);
		const listUserReviews = await reviewServiceInstance.listUserReviews(id);
		return res.json(listUserReviews).status(200);
	} catch (error) {
		console.log(error);
		res.send({ Error: error.message }).status(400);
	}
});

/**
 * @swagger
 *  /reviews:
 *    post:
 *      tags:
 *      - Review
 *      description: 리뷰 등록 api
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - in: body
 *        name: reviewPostParam
 *        schema:
 *          $ref: '#/definitions/reviewPostParam'
 *      responses:
 *       200:
 *        description:
 *        schema:
 */

router.post("/", async (req: Request, res: Response) => {
	try {
		const param = req.body;
		const postResult = await reviewServiceInstance.createReview(param);
		return res.json(postResult).status(201);
	} catch (error) {
		console.log(error);
		res.send({ Error: error.message }).status(400);
	}
});

/**
 * @swagger
 *  /reviews/{id}:
 *    delete:
 *      tags:
 *      - Review
 *      description: 리뷰 삭제 api
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - name: id
 *        type: number
 *        in: path
 *        description: "리뷰 ID"
 *      responses:
 *       200:
 *        description: soft delete success
 *        schema:
 */

router.delete("/:id", async (req: Request, res: Response) => {
	try {
		const param = Number(req.params.id);
		const deleteResult = await reviewServiceInstance.deleteReview(param);
		return res.json(deleteResult).status(201);
	} catch (error) {
		console.log(error);
		res.send({ Error: error.message }).status(400);
	}
});

export default router;
