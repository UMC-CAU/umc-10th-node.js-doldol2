// 1. 가게 등록 요청 데이터
export interface StoreCreateRequest {
  regionId: number;
  name: string;
  address?: string;
}

// 2. 요청 데이터를 시스템에서 쓰는 형태로 변환
export const bodyToStore = (body: StoreCreateRequest) => {
  return {
    regionId: body.regionId,
    name: body.name,
    address: body.address || "",
  };
};

// 3. 응답 변환
export const responseFromStore = (store: any) => {
  return {
    id: store.id,
    regionId: store.region_id,
    name: store.name,
    address: store.address,
    createdAt: store.created_at,
  };
};

// 4. 서비스 레이어로 넘기는 데이터 타입
export interface StoreCreateData {
  regionId: number;
  name: string;
  address: string;
}
