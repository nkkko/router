import { ResolvedRoute, RouteMethodImplementation, RouteMethodsImplementation, isDisabledRoute } from '@/types'
import { RouteMethodPush, RouteMethodReplace } from '@/types/routeMethod'
import { RouterPushImplementation } from '@/utilities/createRouterPush'
import { normalizeRouteParams } from '@/utilities/normalizeRouteParams'
import { assembleUrl } from '@/utilities/urlAssembly'

type RouteMethodsContext = {
  resolved: ResolvedRoute[],
  push: RouterPushImplementation,
}

export function createRouteMethods({ resolved, push }: RouteMethodsContext): RouteMethodsImplementation {
  return resolved.reduce<Record<string, any>>((methods, route) => {
    let level = methods

    route.matches.forEach(match => {
      if (!match.name) {
        return
      }

      const isLeaf = match === route.matched

      if (isLeaf && !isDisabledRoute(route.matched)) {
        const method = createRouteMethod({ route, push })

        level[route.name] = Object.assign(method, level[route.name])
        return
      }

      if (isLeaf) {
        return
      }

      level = level[match.name] ??= {}
    })

    return methods
  }, {})
}

type CreateRouteMethodArgs = {
  route: ResolvedRoute,
  push: RouterPushImplementation,
}

function createRouteMethod({ route, push: routerPush }: CreateRouteMethodArgs): RouteMethodImplementation {
  return (params = {}, options = {}) => {
    const normalizedParams = normalizeRouteParams(params)
    const url = assembleUrl(route, {
      params: normalizedParams,
      query: options.query,
    })

    const push: RouteMethodPush = ({ params, ...options } = {}) => {
      if (params) {
        const normalizedParamOverrides = normalizeRouteParams(params)

        const url = assembleUrl(route, {
          params: {
            ...normalizeRouteParams,
            ...normalizedParamOverrides,
          },
        })

        return routerPush(url, options)
      }

      return routerPush(url, options)
    }

    const replace: RouteMethodReplace = (options) => {
      return routerPush(url, {
        ...options,
        replace: true,
      })
    }

    return {
      url,
      push,
      replace,
    }
  }
}