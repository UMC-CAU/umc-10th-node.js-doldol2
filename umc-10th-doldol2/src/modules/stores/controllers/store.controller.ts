import {
  Body,
  Controller,
  Get,
  Middlewares,
  Path,
  Post,
  Query,
  Request,
  Response,
  Route,
  Tags,
} from "tsoa";
import {
  StoreCreateRequest,
  StoreResponse,
  bodyToStore,
} from "../dtos/store.dto.js";
import { storeCreate } from "../services/store.service.js";
import {
  MissionCreateRequest,
  MissionResponse,
  MissionListResponse,
  bodyToMission,
} from "../../missions/dtos/mission.dto.js";
import { missionCreate, listStoreMissions } from "../../missions/services/mission.service.js";
import {
  ReviewCreateRequest,
  ReviewResponse,
  ReviewListResponse,
  bodyToReview,
} from "../../reviews/dtos/review.dto.js";
import { reviewCreate, listStoreReviews } from "../../reviews/services/review.service.js";
import { ApiResponse, success } from "../../../common/responses/response.js";
import { jwtAuth } from "../../../common/middlewares/jwt.middleware.js";
import { Request as ExpressRequest } from "express";

@Route("stores")
@Tags("Stores")
export class StoreController extends Controller {
  /**
   * 가게 등록 API (로그인 필요)
   * @summary 새로운 가게를 등록합니다.
   */
  @Post()
  @Middlewares(jwtAuth())
  @Response<ApiResponse<StoreResponse>>(200, "가게 등록 성공")
  @Response<ApiResponse<null>>(401, "인증 실패 (AUTH001)")
  @Response<ApiResponse<null>>(404, "존재하지 않는 지역 (S001)")
  public async handleStoreCreate(
    @Body() body: StoreCreateRequest,
  ): Promise<ApiResponse<StoreResponse>> {
    console.log("가게 등록을 요청했습니다!");
    const store = await storeCreate(bodyToStore(body));
    return success(store);
  }

  /**
   * 가게 미션 등록 API (로그인 필요)
   * @summary 특정 가게에 새로운 미션을 등록합니다.
   */
  @Post("{storeId}/missions")
  @Middlewares(jwtAuth())
  @Response<ApiResponse<MissionResponse>>(200, "미션 등록 성공")
  @Response<ApiResponse<null>>(401, "인증 실패 (AUTH001)")
  @Response<ApiResponse<null>>(404, "존재하지 않는 가게 (S002)")
  public async handleMissionCreate(
    @Path() storeId: number,
    @Body() body: MissionCreateRequest,
  ): Promise<ApiResponse<MissionResponse>> {
    console.log("미션 등록을 요청했습니다!");
    const mission = await missionCreate(bodyToMission(storeId, body));
    return success(mission);
  }

  /**
   * 가게 미션 목록 조회 API
   * @summary 특정 가게의 미션 목록을 커서 기반 페이지네이션으로 조회합니다.
   */
  @Get("{storeId}/missions")
  @Response<ApiResponse<MissionListResponse>>(200, "미션 목록 조회 성공")
  @Response<ApiResponse<null>>(404, "존재하지 않는 가게 (S002)")
  public async handleListStoreMissions(
    @Path() storeId: number,
    @Query() cursor?: number,
  ): Promise<ApiResponse<MissionListResponse>> {
    console.log("가게의 미션 목록 조회를 요청했습니다!");
    const result = await listStoreMissions(storeId, cursor ?? 0);
    return success(result);
  }

  /**
   * 가게 리뷰 등록 API (로그인 필요)
   * @summary 특정 가게에 리뷰를 작성합니다. userId는 JWT 토큰에서 자동 추출됩니다.
   */
  @Post("{storeId}/reviews")
  @Middlewares(jwtAuth())
  @Response<ApiResponse<ReviewResponse>>(200, "리뷰 등록 성공")
  @Response<ApiResponse<null>>(401, "인증 실패 (AUTH001)")
  @Response<ApiResponse<null>>(404, "존재하지 않는 가게 (S002)")
  @Response<ApiResponse<null>>(400, "잘못된 별점 범위 (R001)")
  public async handleReviewCreate(
    @Path() storeId: number,
    @Body() body: ReviewCreateRequest,
    @Request() req: ExpressRequest,
  ): Promise<ApiResponse<ReviewResponse>> {
    console.log("리뷰 등록을 요청했습니다!");
    const userId = (req.user as any).id;
    const review = await reviewCreate(bodyToReview(storeId, userId, body));
    return success(review);
  }

  /**
   * 가게 리뷰 목록 조회 API
   * @summary 특정 가게의 리뷰 목록을 커서 기반 페이지네이션으로 조회합니다.
   */
  @Get("{storeId}/reviews")
  @Response<ApiResponse<ReviewListResponse>>(200, "리뷰 목록 조회 성공")
  public async handleListStoreReviews(
    @Path() storeId: number,
    @Query() cursor?: number,
  ): Promise<ApiResponse<ReviewListResponse>> {
    console.log("가게의 리뷰 목록 조회를 요청했습니다!");
    const result = await listStoreReviews(storeId, cursor ?? 0);
    return success(result);
  }
}
