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
  Route,
  Tags,
} from "tsoa";
import { UserSignUpRequest, UserSignUpResponse } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";
import { MissionChallengeRequest, InProgressMissionListResponse, UserMissionResponse } from "../dtos/user-mission.dto.js";
import {
  challengeMission,
  listInProgressMissions,
  completeInProgressMission,
} from "../services/user-mission.service.js";
import { authorizeUser } from "../../../common/middlewares/auth.middleware.js";
import { ApiResponse, success } from "../../../common/responses/response.js";
import { Request as ExpressRequest } from "express";

@Route("users")
@Tags("Users")
export class UserController extends Controller {
  // 회원가입
  @Post("signup")
  public async handleUserSignUp(
    @Body() body: UserSignUpRequest,
  ): Promise<ApiResponse<UserSignUpResponse>> {
    console.log("회원가입을 요청했습니다!");
    console.log("body:", body);
    const user = await userSignUp(body);
    return success(user);
  }

  // 미션 도전하기
  @Post("{userId}/missions")
  public async handleMissionChallenge(
    @Path() userId: number,
    @Body() body: MissionChallengeRequest,
  ): Promise<ApiResponse<UserMissionResponse>> {
    console.log("미션 도전을 요청했습니다!");
    const result = await challengeMission({ userId, missionId: body.missionId });
    return success(result);
  }

  // 내가 진행 중인 미션 목록 조회 (커서 기반 페이지네이션)
  @Get("{userId}/missions")
  public async handleListInProgressMissions(
    @Path() userId: number,
    @Query() cursor?: number,
  ): Promise<ApiResponse<InProgressMissionListResponse>> {
    console.log("내가 진행 중인 미션 목록 조회를 요청했습니다!");
    const result = await listInProgressMissions(userId, cursor ?? 0);
    return success(result);
  }

  // 내가 진행 중인 미션을 진행 완료로 변경
  @Patch("{userId}/missions/{missionId}")
  public async handleCompleteMission(
    @Path() userId: number,
    @Path() missionId: number,
  ): Promise<ApiResponse<UserMissionResponse>> {
    console.log("미션 완료 처리를 요청했습니다!");
    const result = await completeInProgressMission(userId, missionId);
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
