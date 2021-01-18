import { Router, Request, Response } from 'express';
import { wrap } from './wrap';
import reviewRepository from '../repository/reviewRepository';
import reviewService from '../services/reviewService';
import ServiceUtil from '../util/serviceUtil';
import { ReviewPostParam } from '../model/input/ReviewPostParam';
import meetingRepository from '../repository/meetingRepository';
import meetingService from '../services/meetingService';
import { Page } from '../model/Page';
/**
 * @swagger
 * tags:
 *  name: Review
 *  description: Review CRUD
 * definitions:
 *  ReviewPostParam:
 *    type: object
 *    properties:
 *      meetingId:
 *         tyoe: number
 *      userId:
 *         type: string
 *      title:
 *         type: string
 *      content:
 *         type: string
 */

const router = Router();
// DI
const serviceUtilInstance = new ServiceUtil();
const reviewRepositoryInstance = new reviewRepository(serviceUtilInstance);
const meetingRepositoryInstance = new meetingRepository(serviceUtilInstance);
const meetingServiceInstance = new meetingService(meetingRepositoryInstance, serviceUtilInstance);
const reviewServiceInstance = new reviewService(reviewRepositoryInstance, serviceUtilInstance);

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
  wrap(async (req: Request, res: Response) => {
    const id = req.params.id ? Number(req.params.id) : 0;
    const result = await reviewServiceInstance.getReview(id);
    return res.json({ result });
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
 *      - name: pageSize
 *        type: number
 *        in: query
 *        description: "페이지 크기"
 *        required: true
 *      - name: meetingId
 *        type: number
 *        in: query
 *        description: "모임 ID"
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
  wrap(async (req: Request, res: Response) => {
    const meetingId = req.query.meetingId ? Number(req.query.meetingId) : 0;
    const userId = req.query.userId ? String(req.query.userId) : '';
    const page: Page = {
      pageNum: Number(req.query.pageNum) || 0,
      pageSize: Number(req.query.pageSize) || 0,
    };
    const result = await reviewServiceInstance.listReviews(meetingId, userId, page);
    return res.json({ result });
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
 *        name: Review
 *        schema:
 *          $ref: '#/definitions/ReviewPostParam'
 *      responses:
 *       200:
 */

router.post(
  '/',
  wrap(async (req: Request, res: Response) => {
    const reviewInfo: ReviewPostParam = {
      meetingId: req.body.meetingId || 0,
      userId: req.body.userId || '',
      title: req.body.title || '',
      content: req.body.content || '',
    };
    const condition = (await meetingServiceInstance.checkReviewCondition(reviewInfo)) || false;
    const result = await reviewServiceInstance.createReview(condition, reviewInfo);
    return res.status(201).json({ result });
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
  wrap(async (req: Request, res: Response) => {
    const id = req.params.id ? Number(req.params.id) : 0;
    const result = await reviewServiceInstance.deleteReview(id);
    return res.json({ result });
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
 *        name: Review
 *        schema:
 *          $ref: '#/definitions/ReviewPostParam'
 *      responses:
 *       200:
 */

router.put(
  '/:id',
  wrap(async (req: Request, res: Response) => {
    const id = req.params.id ? Number(req.params.id) : 0;

    const reviewInfo: ReviewPostParam = {
      meetingId: req.body.meetingId || 0,
      userId: req.body.userId || '',
      title: req.body.title || '',
      content: req.body.content || '',
    };
    const result = await reviewServiceInstance.updateReview(id, reviewInfo);
    return res.json({ result });
  }),
);

export default router;
