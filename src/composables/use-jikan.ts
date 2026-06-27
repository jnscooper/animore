/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import type { Fallback } from '@/types/common'
import { createRequest } from '@/utils/request'

type AsyncData<D, E = Error> = {
  pending: Ref<boolean>
  data: Ref<D>
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

type RefArgs<T> = {
  [K in keyof T]: Ref<T[K]>
}

const collectRefs = (obj: any, refs: Ref[] = []) => {
  if (isRef(obj)) {
    refs.push(obj)
    return refs
  }

  if (obj && typeof obj === 'object') {
    Object.values(obj).forEach((v) => collectRefs(v, refs))
  }

  return refs
}

type FlattenData<T, Enable extends boolean> = Enable extends true
  ? T extends { data: infer D }
    ? Omit<T, 'data'> & D
    : T
  : T

type FlattenPagination<T, Enable extends boolean> = Enable extends true
  ? T extends { pagination: infer P }
    ? Omit<T, 'pagination'> & P
    : T
  : T

type FlattenUnwrap<T, U> = FlattenPagination<
  FlattenData<T, U extends { unwrap: { data: true } } ? true : false>,
  U extends { unwrap: { pagination: true } } ? true : false
>

type RelatedKeys<T> = {
  readonly [K in keyof T]?: boolean
}

type BuildOptions<Raw, U> = (Raw & { unwrap?: U }) | RefArgs<Raw & { unwrap?: U }>

/**
 * Path reference {@linkcode JikanPaths}
 */
export const useJikan = <
  const Path extends keyof JikanPaths,
  const U extends RelatedKeys<JikanPaths[Path][1]> = RelatedKeys<JikanPaths[Path][1]>,
>(
  path: Path,
  ...args: HasRequired<JikanPaths[Path][0]> extends true
    ? [opt: BuildOptions<JikanPaths[Path][0], U>]
    : [opt?: BuildOptions<JikanPaths[Path][0], U>]
) => {
  const opt = args[0] ?? {}
  const {
    query = {},
    body = {},
    unwrap = { data: false, pagination: false },
    ...slots
  } = opt as JikanArguments<any> & { unwrap: U }

  path = path.replace(/\{([^}]+)\}/g, (_, key) => (slots as Record<string, any>)?.[key]) as Path

  const pending = ref(false)
  const data = ref<Awaited<JikanPaths[Path][1]>>()
  const error = ref<Fallback<JikanPaths[Path][2], Error>>()

  const execute = () => {
    pending.value = true
    jikanRequest
      .get(path, {
        params: unref(query),
      })
      .then((res) => {
        const _data = Object.entries(unwrap).reduce(
          (acc, [key, value]) => (
            value && key in res ? (acc = { ...acc, ...res[key] }) : (acc = res),
            acc
          ),
          {} as Awaited<JikanPaths[Path][1]>,
        )
        data.value = _data
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

  const refs = collectRefs(opt)

  console.log('refs', refs)

  if (refs.length) {
    watch(refs, execute, { deep: true })
  }

  return {
    pending,
    data,
    error,
    refresh: execute,
  } as AsyncData<
    FlattenUnwrap<JikanPaths[Path][1], { unwrap: U }>,
    Fallback<JikanPaths[Path][2], Error>
  >
}
