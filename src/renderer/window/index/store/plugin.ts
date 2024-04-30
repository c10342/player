import { PiniaPluginContext, StateTree, _ActionsTree, _GettersTree } from "pinia";

export const persistence = (
  context: PiniaPluginContext<string, StateTree, _GettersTree<StateTree>, _ActionsTree>
) => {
  window.api.getStore(`pinia-state-${context.store.$id}`).then((res) => {
    if (res) {
      const json = JSON.parse(res);
      context.store.$patch(json);
    }
  });

  context.store.$subscribe((newState) => {
    window.api.setStore({
      key: `pinia-state-${newState.storeId}`,
      value: JSON.stringify(context.pinia.state.value[newState.storeId])
    });
  });
};
