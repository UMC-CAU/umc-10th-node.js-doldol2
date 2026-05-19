// 2. 요청 데이터를 시스템에서 쓰는 형태로 변환
export const bodyToStore = (body) => {
    return {
        regionId: body.regionId,
        name: body.name,
        address: body.address || "",
    };
};
// 3. 응답 변환
export const responseFromStore = (store) => {
    return {
        id: store.id,
        regionId: store.region_id,
        name: store.name,
        address: store.address,
        createdAt: store.created_at,
    };
};
//# sourceMappingURL=store.dto.js.map