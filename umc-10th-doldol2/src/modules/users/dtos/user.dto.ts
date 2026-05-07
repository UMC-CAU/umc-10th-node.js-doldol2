// 1. 회원가입 요청 데이터의 설계도를 만듭니다.
export interface UserSignUpRequest {
  email: string;
  name: string;
  gender: string;
  birth: string;
  address?: string;       // ?가 붙으면 '없을 수도 있음(선택)'이라는 뜻이에요!
  detailAddress?: string;
  phoneNumber: string;
  preferences: number[];
}

// 2. 요청받은 데이터를 우리 시스템에 맞는 데이터로 변환해주는 함수입니다.
export const bodyToUser = (body: UserSignUpRequest) => {
  const birth = new Date(body.birth); //날짜 변환

  return {
    email: body.email, //필수
    name: body.name, // 필수
    gender: body.gender, // 필수
    birth, // 필수
    address: body.address || "", //선택
    detailAddress: body.detailAddress || "", //선택
    phoneNumber: body.phoneNumber,//필수
    preferences: body.preferences,// 필수
  };
};

// 응답 DTO 타입
export interface UserSignUpResponse {
  email: string;
  name: string;
  preferCategory: string[];
}

export const responseFromUser = (data: { user: any; preferences: any[] }): UserSignUpResponse => {
  // Prisma의 include 옵션으로 가져온 foodCategory의 name을 추출
  const preferCategory = data.preferences.map((p) => p.foodCategory.name);

  return {
    email: data.user.email,
    name: data.user.name,
    preferCategory: preferCategory,
  };
};

// 3. bodyToUser가 반환하는 데이터 타입
export interface UserSignUpData {
  email: string;
  name: string;
  gender: string;
  birth: Date;        // ← Date 타입
  address: string;
  detailAddress: string;
  phoneNumber: string;
  preferences: number[];
}
