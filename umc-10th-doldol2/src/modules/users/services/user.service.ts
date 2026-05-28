import { UserSignUpRequest, UserSignUpResponse, responseFromUser } from "../dtos/user.dto.js";
import { signupTx } from "../repositories/user.repository.js";
import { DuplicateUserEmailError } from "../../../common/errors/error.js";

export const userSignUp = async (data: UserSignUpRequest): Promise<UserSignUpResponse> => {
  const result = await signupTx({
    email: data.email,
    name: data.name,
    gender: data.gender,
    birth: new Date(data.birth),
    address: data.address ?? "",
    detailAddress: data.detailAddress ?? "",
    phoneNumber: data.phoneNumber,
    preferences: data.preferences,
  });

  if (result === null) {
    throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data);
  }

  return responseFromUser({
    user: result.user,
    preferences: result.preferences,
  });
};

import { UserUpdateRequest, UserUpdateResponse, responseFromUpdatedUser } from "../dtos/user.dto.js";
import { updateUserTx } from "../repositories/user.repository.js";
import { UserNotFoundError } from "../../../common/errors/error.js";

export const updateUser = async (
  userId: number,
  data: UserUpdateRequest
): Promise<UserUpdateResponse> => {
  try {
    const result = await updateUserTx(userId, {
      name: data.name,
      gender: data.gender,
      birth: data.birth ? new Date(data.birth) : undefined,
      address: data.address,
      detailAddress: data.detailAddress,
      phoneNumber: data.phoneNumber,
      preferences: data.preferences,
    });
    return responseFromUpdatedUser(result.user, result.preferences);
  } catch (err: any) {
    if (err?.code === "P2025") {
      throw new UserNotFoundError("존재하지 않는 사용자입니다.", { userId });
    }
    throw err;
  }
};
