import { PiniaPluginContext, StateTree, _ActionsTree, _GettersTree } from "pinia";

export const persistence = (
  context: PiniaPluginContext<string, StateTree, _GettersTree<StateTree>, _ActionsTree>
) => {
  context.store.$subscribe(() => {
    window.api.setStore({
      key: `pinia-state`,
      value: JSON.stringify(context.pinia.state.value)
    });
  });
};
