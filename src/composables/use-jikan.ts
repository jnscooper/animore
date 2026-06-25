/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import type { Fallback } from '@/types/common'
import { createRequest } from '@/utils/request'

type AsyncData<T, E = Error> = {
  pending: Ref<boolean>
  data: Ref<T>
  error: Ref<E>
  refresh: () => void
}

const jikanRequest = createRequest('https://api.jikan.moe/v4/', {
  unwrap: true,
})

type HasRequired<T extends object> = keyof {
  [K in keyof T as {} extends Pick<T, K> ? never : K]: true
} extends never
  ? false
  : true

/**
 * Path reference {@linkcode JikanPaths}
 */
export const useJikan = <Path extends keyof JikanPaths>(
  path: Path,
  ...args: HasRequired<JikanPaths[Path][0]> extends true
    ? [opt: JikanPaths[Path][0]]
    : [opt?: JikanPaths[Path][0]]
) => {
  const opt = args[0]
  const { query = {}, body = {}, ...slots } = opt as JikanArguments<any>

  console.log(slots)

  path = path.replace(/\{([^}]+)\}/g, (_, key) => (slots as Record<string, any>)?.[key]) as Path

  const pending = ref(false)
  const data = ref<Awaited<JikanPaths[Path][1]>>()
  const error = ref<Fallback<JikanPaths[Path][2], Error>>()

  const execute = () => {
    pending.value = true
    jikanRequest
      .get(path, {
        params: query,
      })
      .then((res) => {
        data.value = res
        error.value = undefined
      })
      .catch((err) => {
        console.error('[useJikan]', err)
        data.value = undefined
        error.value = err
      })
      .finally(() => {
        pending.value = false
      })
  }

  execute()

  return {
    pending,
    data,
    error,
    refresh: execute,
  } as AsyncData<JikanPaths[Path][1], Fallback<JikanPaths[Path][2], Error>>
}
