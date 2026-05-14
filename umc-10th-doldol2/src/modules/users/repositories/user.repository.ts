import { prisma } from "../db.config.js";

// 1. User 데이터 삽입 (단일 INSERT, 트랜잭션 외부에서 사용 가능)
export const addUser = async (data: {
  email: string;
  name: string;
  gender: string;
  birth: Date;
  address: string;
  detailAddress: string;
  phoneNumber: string;
}): Promise<number | null> => {
  // 1. 이미 존재하는 이메일인지 확인
  const user = await prisma.user.findFirst({ where: { email: data.email } });

  if (user) {
    return null;
  }

  // 2. 새로운 유저 생성
  const created = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      gender: data.gender,
      birth: data.birth,
      address: data.address,
      detailAddress: data.detailAddress,
      phoneNumber: data.phoneNumber,
    },
  });

  return created.id;
};

// 2. 사용자 정보 얻기
export const getUser = async (userId: number) => {
  return await prisma.user.findFirstOrThrow({ where: { id: userId } });
};

// 3. 음식 선호 카테고리 매핑
export const setPreference = async (
  userId: number,
  foodCategoryId: number
): Promise<void> => {
  await prisma.userFavorCategory.create({
    data: {
      userId: userId,
      foodCategoryId: foodCategoryId,
    },
  });
};

// 4. 사용자 선호 카테고리 반환 (JOIN)
export const getUserPreferencesByUserId = async (userId: number) => {
  return await prisma.userFavorCategory.findMany({
    where: { userId: userId },
    include: {
      foodCategory: true,
    },
    orderBy: { foodCategoryId: "asc" },
  });
};

// 5. 회원가입 (트랜잭션) ─ user 생성 + preference 매핑을 원자적으로 처리
//
//  중간에 하나라도 실패하면 모든 변경이 롤백됩니다.
//  (예: foodCategoryId 가 잘못된 경우, 유저까지 같이 롤백되어 깔끔한 상태 유지)
export const signupTx = async (data: {
  email: string;
  name: string;
  gender: string;
  birth: Date;
  address: string;
  detailAddress: string;
  phoneNumber: string;
  preferences: number[];
}) => {
  return prisma.$transaction(async (tx) => {
    // 1) 이메일 중복 검사
    const exists = await tx.user.findFirst({ where: { email: data.email } });
    if (exists) {
      // null 반환 → service 에서 "이미 존재하는 이메일" 처리
      return null;
    }

    // 2) 유저 생성
    const created = await tx.user.create({
      data: {
        email: data.email,
        name: data.name,
        gender: data.gender,
        birth: data.birth,
        address: data.address,
        detailAddress: data.detailAddress,
        phoneNumber: data.phoneNumber,
      },
    });

    // 3) 선호 카테고리 매핑 (한 번에 createMany 로)
    if (data.preferences && data.preferences.length > 0) {
      await tx.userFavorCategory.createMany({
        data: data.preferences.map((foodCategoryId) => ({
          userId: created.id,
          foodCategoryId,
        })),
      });
    }

    // 4) 응답용으로 한 번에 읽어오기 (관계 include)
    const user = await tx.user.findUniqueOrThrow({ where: { id: created.id } });
    const preferences = await tx.userFavorCategory.findMany({
      where: { userId: created.id },
      include: { foodCategory: true },
      orderBy: { foodCategoryId: "asc" },
    });

    return { user, preferences };
  });
};
