import {
  Body,
  Controller,
  Get,
  Middlewares,
  Patch,
  Path,
  Post,
  Query,
  Request,
  Response,
  Route,
  Tags,
} from "tsoa";
import { UserSignUpRequest, UserSignUpResponse } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";
import {
  MissionChallengeRequest,
  InProgressMissionListResponse,
  UserMissionResponse,
} from "../dtos/user-mission.dto.js";
import {
  challengeMission,
  listInProgressMissions,
  completeInProgressMission,
} from "../services/user-mission.service.js";
import { ReviewListResponse } from "../../reviews/dtos/review.dto.js";
import { listMyReviews } from "../../reviews/services/review.service.js";
import { authorizeUser } from "../../../common/middlewares/auth.middleware.js";
import { ApiResponse, success } from "../../../common/responses/response.js";
import { Request as ExpressRequest } from "express";

@Route("users")
@Tags("Users")
export class UserController extends Controller {
  /**
   * 회원가입 API
   * @summary 신규 유저를 등록합니다.
   */
  @Post("signup")
  @Response<ApiResponse<UserSignUpResponse>>(200, "회원가입 성공")
  @Response<ApiResponse<null>>(409, "중복된 이메일 에러 (U001)")
  public async handleUserSignUp(
    @Body() body: UserSignUpRequest,
  ): Promise<ApiResponse<UserSignUpResponse>> {
    console.log("회원가입을 요청했습니다!");
    console.log("body:", body);
    const user = await userSignUp(body);
    return success(user);
  }

  /**
   * 미션 도전 API
   * @summary 특정 유저가 미션에 도전합니다.
   */
  @Post("{userId}/missions")
  @Response<ApiResponse<UserMissionResponse>>(200, "미션 도전 성공")
  @Response<ApiResponse<null>>(404, "유저 또는 미션을 찾을 수 없음 (U002 / M001)")
  @Response<ApiResponse<null>>(409, "이미 도전 중인 미션 (M002)")
  public async handleMissionChallenge(
    @Path() userId: number,
    @Body() body: MissionChallengeRequest,
  ): Promise<ApiResponse<UserMissionResponse>> {
    console.log("미션 도전을 요청했습니다!");
    const result = await challengeMission({ userId, missionId: body.missionId });
    return success(result);
  }

  /**
   * 진행 중인 미션 목록 조회 API
   * @summary 유저가 진행 중인 미션 목록을 커서 기반 페이지네이션으로 조회합니다.
   */
  @Get("{userId}/missions")
  @Response<ApiResponse<InProgressMissionListResponse>>(200, "미션 목록 조회 성공")
  @Response<ApiResponse<null>>(404, "유저를 찾을 수 없음 (U002)")
  public async handleListInProgressMissions(
    @Path() userId: number,
    @Query() cursor?: number,
  ): Promise<ApiResponse<InProgressMissionListResponse>> {
    console.log("내가 진행 중인 미션 목록 조회를 요청했습니다!");
    const result = await listInProgressMissions(userId, cursor ?? 0);
    return success(result);
  }

  /**
   * 미션 완료 처리 API
   * @summary 진행 중인 미션을 완료 상태로 변경합니다.
   */
  @Patch("{userId}/missions/{missionId}")
  @Response<ApiResponse<UserMissionResponse>>(200, "미션 완료 처리 성공")
  @Response<ApiResponse<null>>(404, "유저 또는 미션을 찾을 수 없음 (U002 / M001)")
  @Response<ApiResponse<null>>(400, "진행 중 상태가 아닌 미션 (M003)")
  public async handleCompleteMission(
    @Path() userId: number,
    @Path() missionId: number,
  ): Promise<ApiResponse<UserMissionResponse>> {
    console.log("미션 완료 처리를 요청했습니다!");
    const result = await completeInProgressMission(userId, missionId);
    return success(result);
  }

  /**
   * 내가 작성한 리뷰 목록 조회 API
   * @summary 특정 유저가 작성한 리뷰 목록을 커서 기반 페이지네이션으로 조회합니다.
   */
  @Get("{userId}/reviews")
  @Response<ApiResponse<ReviewListResponse>>(200, "리뷰 목록 조회 성공")
  @Response<ApiResponse<null>>(404, "유저를 찾을 수 없음 (U002)")
  public async handleListMyReviews(
    @Path() userId: number,
    @Query() cursor?: number,
  ): Promise<ApiResponse<ReviewListResponse>> {
    console.log("내가 작성한 리뷰 목록 조회를 요청했습니다!");
    const result = await listMyReviews(userId, cursor ?? 0);
    return success(result);
  }

  // 게스트 페이지 (로그인 불필요)
  @Get("guest")
  public async handleGuestPage(): Promise<string> {
    return `
      <h1>게스트 페이지</h1>
      <p>이 페이지는 로그인이 필요 없습니다.</p>
      <ul>
        <li><a href="/api/v1/users/mypage">마이페이지 (로그인 필요)</a></li>
      </ul>
    `;
  }

  // 로그인 페이지
  @Get("login")
  public async handleLoginPage(): Promise<string> {
    return "<h1>로그인 페이지</h1><p>로그인이 필요한 페이지에서 튕겨나오면 여기로 옵니다.</p>";
  }

  // 마이페이지 (로그인 필요)
  @Get("mypage")
  @Middlewares(authorizeUser())
  public async handleMypage(@Request() req: ExpressRequest): Promise<string> {
    return `
      <h1>마이페이지</h1>
      <p>환영합니다, ${req.cookies.username}님!</p>
      <p>이 페이지는 로그인한 사람만 볼 수 있습니다.</p>
    `;
  }

  // 로그인 쿠키 세팅
  @Get("set-login")
  public async handleSetLogin(@Request() req: ExpressRequest): Promise<string> {
    req.res!.cookie("username", "UMC10th", { maxAge: 3600000 });
    return '로그인 쿠키(username=UMC10th) 생성 완료! <a href="/api/v1/users/mypage">마이페이지로 이동</a>';
  }

  // 로그아웃 (쿠키 삭제)
  @Get("set-logout")
  public async handleSetLogout(@Request() req: ExpressRequest): Promise<string> {
    req.res!.clearCookie("username");
    return '로그아웃 완료 (쿠키 삭제). <a href="/api/v1/users/guest">메인으로</a>';
  }
}
