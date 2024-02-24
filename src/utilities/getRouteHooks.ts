import { RouteHook, RouteHookTiming } from '@/types'
import { ResolvedRoute } from '@/types/resolved'
import { asArray } from '@/utilities/array'
import { isRouteEnter, isRouteLeave, isRouteUpdate } from '@/utilities/hooks'

export function getRouteHooks(to: ResolvedRoute, from: ResolvedRoute | null, type: RouteHookTiming): RouteHook[] {
  switch (type) {
    case 'before':
      return getRouteBeforeHooks(to, from)
    case 'after':
      throw 'not implemented'
    default:
      const exhaustive: never = type
      throw new Error(`Missing RouteHookTiming condition in getRouteHooks: ${exhaustive}`)
  }
}

function getRouteBeforeHooks(to: ResolvedRoute, from: ResolvedRoute | null): RouteHook[] {
  const toHooks = to.matches.flatMap((route, depth) => {
    const hooks = []

    if (route.onBeforeRouteEnter && isRouteEnter(to, from, depth)) {
      hooks.push(...asArray(route.onBeforeRouteEnter))
    }

    if (route.onBeforeRouteUpdate && isRouteUpdate(to, from, depth)) {
      hooks.push(...asArray(route.onBeforeRouteUpdate))
    }

    return hooks
  })

  const fromHooks = from?.matches.flatMap((route, depth) => {
    const hooks = []

    if (route.onBeforeRouteLeave && isRouteLeave(to, from, depth)) {
      hooks.push(...asArray(route.onBeforeRouteLeave))
    }

    return hooks
  }) ?? []

  return [...fromHooks, ...toHooks]
}