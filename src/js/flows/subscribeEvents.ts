import {LakeModel} from "../models/lake"
import {Thunk} from "../state/types"

export const subscribeEvents =
  (lake?: LakeModel): Thunk<Promise<EventSource>> =>
  async (d, gs, {api}) => {
    const zealot = await api.getZealot(lake)

    return zealot.subscribe()
  }
