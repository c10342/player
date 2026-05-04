const isPlainObject = (val: unknown): val is Record<string, unknown> => {
  return (
    val !== null &&
    typeof val === "object" &&
    (Object.getPrototypeOf(val) === null || Object.getPrototypeOf(val) === Object.prototype)
  );
};

const serializeIfNeeded = (val: unknown): unknown => {
  if (val === null || val === undefined) return val;
  if (typeof val !== "object") return val;
  if (isPlainObject(val)) return val;
  if (Array.isArray(val)) return val;

  const obj: Record<string, unknown> = {};
  for (const key of Object.getOwnPropertyNames(val)) {
    obj[key] = (val as unknown as Record<string, unknown>)[key];
  }
  return obj;
};

export const wrapLogFn = (fn: (...params: unknown[]) => void) => {
  return (...params: unknown[]) => {
    fn(...params.map(serializeIfNeeded));
  };
};
