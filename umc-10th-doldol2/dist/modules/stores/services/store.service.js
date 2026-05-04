import { responseFromStore } from "../dtos/store.dto.js";
import { addStore, existsRegion, getStore } from "../repositories/store.repository.js";
export const storeCreate = async (data) => {
    // 1. 지역 존재 여부 검증
    const regionOk = await existsRegion(data.regionId);
    if (!regionOk) {
        throw new Error("존재하지 않는 지역입니다.");
    }
    // 2. 가게 INSERT
    const storeId = await addStore({
        regionId: data.regionId,
        name: data.name,
        address: data.address,
    });
    // 3. 방금 만든 가게 다시 조회해서 반환
    const store = await getStore(storeId);
    return responseFromStore(store);
};
//# sourceMappingURL=store.service.js.map