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
