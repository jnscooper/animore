export type IsUnknown<T> = unknown extends T
  ? T extends unknown
    ? keyof T extends never
      ? true
      : false
    : false
  : false

export type IsUndefined<T> = [T] extends [undefined] ? true : false

export type Fallback<T, FallbackType = T> = IsUndefined<T> extends true ? FallbackType : T
