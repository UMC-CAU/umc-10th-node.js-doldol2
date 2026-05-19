// 요청 DTO
export interface StoreCreateRequest {
  /** 지역 ID */
  regionId: number;
  /** 가게 이름 */
  name: string;
  /** 가게 주소 (선택) */
  address?: string;
}

// 응답 DTO
export interface StoreResponse {
  /** 가게 ID */
  id: number;
  /** 지역 ID */
  regionId: number;
  /** 가게 이름 */
  name: string;
  /** 가게 주소 */
  address: string;
  /** 생성일시 */
  createdAt: Date;
}

export const bodyToStore = (body: StoreCreateRequest) => {
  return {
    regionId: body.regionId,
    name: body.name,
    address: body.address || "",
  };
};

export const responseFromStore = (store: any): StoreResponse => {
  return {
    id: store.id,
    regionId: store.regionId,
    name: store.name,
    address: store.address,
    createdAt: store.createdAt,
  };
};

export interface StoreCreateData {
  regionId: number;
  name: string;
  address: string;
}
