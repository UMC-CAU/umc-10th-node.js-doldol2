// 요청 DTO
export interface UserSignUpRequest {
  /** 유저 이메일 (로그인 시 사용, 중복 불가) */
  email: string;
  /** 유저 이름 */
  name: string;
  /** 성별 (예: "male" / "female") */
  gender: string;
  /** 생년월일 (예: "1999-01-01") */
  birth: string;
  /** 주소 (선택) */
  address?: string;
  /** 상세 주소 (선택) */
  detailAddress?: string;
  /** 휴대폰 번호 */
  phoneNumber: string;
  /** 선호 음식 카테고리 ID 배열 (예: [1, 2]) */
  preferences: number[];
}

// 응답 DTO
export interface UserSignUpResponse {
  /** 가입된 이메일 */
  email: string;
  /** 가입된 이름 */
  name: string;
  /** 선호 카테고리 이름 배열 */
  preferCategory: string[];
}

export const responseFromUser = (data: { user: any; preferences: any[] }): UserSignUpResponse => {
  const preferCategory = data.preferences.map((p) => p.foodCategory.name);
  return {
    email: data.user.email,
    name: data.user.name,
    preferCategory,
  };
};

// ───────────────────────────────────────────────────────────
// 유저 정보 수정 요청 DTO (모든 필드 선택 사항)
// ───────────────────────────────────────────────────────────
export interface UserUpdateRequest {
  /** 이름 */
  name?: string;
  /** 성별 */
  gender?: string;
  /** 생년월일 (예: "1999-01-01") */
  birth?: string;
  /** 주소 */
  address?: string;
  /** 상세 주소 */
  detailAddress?: string;
  /** 휴대폰 번호 */
  phoneNumber?: string;
  /** 선호 카테고리 ID 배열 (전달 시 기존 목록 전체 교체) */
  preferences?: number[];
}

// 유저 수정 응답 DTO
export interface UserUpdateResponse {
  /** 유저 ID */
  id: number;
  /** 이메일 */
  email: string;
  /** 이름 */
  name: string;
  /** 성별 */
  gender: string;
  /** 생년월일 */
  birth: Date;
  /** 주소 */
  address: string;
  /** 상세 주소 */
  detailAddress: string | null;
  /** 휴대폰 번호 */
  phoneNumber: string;
  /** 선호 카테고리 이름 배열 */
  preferCategory: string[];
}

export const responseFromUpdatedUser = (
  user: any,
  preferences: any[]
): UserUpdateResponse => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    gender: user.gender,
    birth: user.birth,
    address: user.address,
    detailAddress: user.detailAddress ?? null,
    phoneNumber: user.phoneNumber,
    preferCategory: preferences.map((p) => p.foodCategory.name),
  };
};
