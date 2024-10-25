import { isNull, isUndefined } from "lodash";

export const isUnDef = (data: any): data is null | undefined => {
  return isNull(data) || isUndefined(data);
};
