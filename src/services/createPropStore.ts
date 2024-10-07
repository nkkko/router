import { InjectionKey, reactive } from 'vue'
import { isWithComponent, isWithComponents } from '@/types/createRouteOptions'
import { ResolvedRoute } from '@/types/resolved'
import { Route } from '@/types/route'
import { MaybePromise } from '@/types/utilities'

export const propStoreKey: InjectionKey<PropStore> = Symbol()

type ComponentProps = { id: string, name: string, props?: (params: Record<string, unknown>) => unknown }

type RoutePropsContext = {
  /**
   * The unique route id generated by `createRouteId`
   */
  id: string,
  /**
   * The named view the component was assigned to
   */
  name: string,
  /**
   * The specific params for the actual route
   */
  params: unknown,
}

/**
 * A unique identifier for a route component's props based on the route id, view name, and stringified params
 * Format: `${id}-${name}-${params}
 */
type RoutePropsKey = `${string}-${string}-${string}`

/**
 * Loose map for storing component props for a specific route
 */
export type RouteProps = Map<RoutePropsKey, unknown>

type SetRoutePropsOptions = {
  prefetched: boolean,
}

export type PropStore = {
  /**
   * Returns all of the props for a specific route
   */
  getRouteProps: (route: ResolvedRoute) => RouteProps,

  /**
   * Updates the props store with the props for a specific route.
   */
  setRouteProps: (props: RouteProps, options: SetRoutePropsOptions) => void,

  /**
   * Updates the props store with the props for a specific route. Skipped if prefetched props for the same route were already set
   */
  loadRouteProps: (route: ResolvedRoute) => void,

  /**
   * Returns the props for a specific route component
   */
  getProps: (context: RoutePropsContext) => MaybePromise<unknown> | undefined,
}

export function createPropStore(): PropStore {
  const store: RouteProps = reactive(new Map())

  let prefetched = false

  const getRouteProps: PropStore['getRouteProps'] = ({ matches, params }) => {
    const response: RouteProps = new Map()
    const components = matches.flatMap(match => getComponentProps(match))

    for (const { id, name, props } of components) {
      if (!props) {
        continue
      }

      const key = getPropKey({ id, name, params })
      const value = props(params)

      response.set(key, value)
    }

    return response
  }

  const setRouteProps: PropStore['setRouteProps'] = (props, options) => {
    store.clear()

    prefetched = options.prefetched

    for (const [key, value] of props) {
      store.set(key, value)
    }
  }

  const loadRouteProps: PropStore['loadRouteProps'] = (route) => {
    if (prefetched) {
      return
    }

    const props = getRouteProps(route)

    setRouteProps(props, { prefetched: false })
  }

  const getProps: PropStore['getProps'] = (context) => {
    const key = getPropKey(context)

    return store.get(key)
  }

  function getPropKey({ id, name, params }: RoutePropsContext): RoutePropsKey {
    return `${id}-${name}-${JSON.stringify(params)}`
  }

  function getComponentProps(options: Route['matched']): ComponentProps[] {
    if (isWithComponents(options)) {
      return Object.entries(options.props ?? {}).map(([name, props]) => ({ id: options.id, name, props }))
    }

    if (isWithComponent(options)) {
      return [
        {
          id: options.id,
          name: 'default',
          props: options.props,
        },
      ]
    }

    return []
  }

  return {
    getRouteProps,
    setRouteProps,
    loadRouteProps,
    getProps,
  }
}