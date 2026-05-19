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
