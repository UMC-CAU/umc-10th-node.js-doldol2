import { StoreCreateData, responseFromStore } from "../dtos/store.dto.js";
import { addStore, existsRegion, getStore } from "../repositories/store.repository.js";
import { RegionNotFoundError } from "../../../common/errors/error.js";

export const storeCreate = async (data: StoreCreateData) => {
  const regionOk = await existsRegion(data.regionId);
  if (!regionOk) {
    throw new RegionNotFoundError("존재하지 않는 지역입니다.", { regionId: data.regionId });
  }

  const storeId = await addStore({
    regionId: data.regionId,
    name: data.name,
    address: data.address,
  });

  const store = await getStore(storeId);
  return responseFromStore(store);
};
