export const encode = (data: unknown) => {
  return btoa(encodeURIComponent(JSON.stringify(data)))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const decode = <T = any>(text: string): T => {
  return JSON.parse(decodeURIComponent(atob(text))) as T
}
