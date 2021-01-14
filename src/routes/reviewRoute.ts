import { Router, Request, Response, NextFunction } from 'express';
import { wrap } from './wrap';
import reviewMapper from '../mapper/reviewMapper';
import reviewService from '../services/reviewService';
import serviceUtil from '../util/serviceUtil';
import { ReviewPostParam } from '../model/input/ReviewPostParam';
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
const serviceUtilInstance = new serviceUtil();
const reviewMapperInstance = new reviewMapper(serviceUtilInstance);
const reviewServiceInstance = new reviewService(reviewMapperInstance, serviceUtilInstance);

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
 */

router.get(
  '/:id',
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const result = await reviewServiceInstance.getReview(id);
    return res.status(result.status).json(result.message);
  }),
);

/**
 * @swagger
 *  /reviews:
 *    get:
 *      tags:
 *      - Meeting
 *      description: 전체 리뷰글 리스트를 가져온다. query에 따라 모임별 리뷰나 유저별 리뷰를 가져올 수 있다
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - name: pageNum
 *        type: number
 *        in: query
 *        description: "페이지 번호"
 *        required: true
 *      - name: meetingId
 *        type: number
 *        in: query
 *        description: "호스트 ID"
 *      - name: userId
 *        type: string
 *        in: query
 *        description: "유저 ID"
 *      responses:
 *       200:
 *        description: board of review list
 */

router.get(
  '/',
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const meetingId = Number(req.query.meetingId);
    const userId = String(req.query.userId);
    const pageNum = Number(req.query.pageNum);
    const result = await reviewServiceInstance.listReviews(meetingId, userId, pageNum);
    return res.status(result.status).json(result.message);
  }),
);

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
 */

router.post(
  '/',
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const reviewInfo = req.body as ReviewPostParam;
    const result = await reviewServiceInstance.createReview(reviewInfo);
    return res.status(result.status).json(result.message);
  }),
);

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
 */

router.delete(
  '/:id',
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const result = await reviewServiceInstance.deleteReview(id);
    return res.status(result.status).json(result.message);
  }),
);

/**
 * @swagger
 *  /reviews/{id}:
 *    put:
 *      tags:
 *      - Review
 *      description: 리뷰 수정 api
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - in: path
 *        name: id
 *        type: number
 *        description: "리뷰 ID"
 *      - in: body
 *        name: reviewPostParam
 *        schema:
 *          $ref: '#/definitions/reviewPostParam'
 *      responses:
 *       200:
 */

router.put(
  '/:id',
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const reviewInfo = req.body as ReviewPostParam;
    const result = await reviewServiceInstance.updateReview(id, reviewInfo);
    return res.status(result.status).json(result.message);
  }),
);

export default router;
