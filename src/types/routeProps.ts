import { AsyncComponentLoader, Component, DefineComponent } from 'vue'
import { AfterRouteHook, BeforeRouteHook } from '@/types/hooks'
import { Path } from '@/types/path'
import { Query } from '@/types/query'
import { Routes } from '@/types/route'
import { MaybeArray } from '@/types/utilities'

export type RouteComponent = Component | DefineComponent | AsyncComponentLoader

export interface RouteMeta extends Record<string, unknown> {}

type WithHooks = {
  onBeforeRouteEnter?: MaybeArray<BeforeRouteHook>,
  onBeforeRouteUpdate?: MaybeArray<BeforeRouteHook>,
  onBeforeRouteLeave?: MaybeArray<BeforeRouteHook>,
  onAfterRouteEnter?: MaybeArray<AfterRouteHook>,
  onAfterRouteUpdate?: MaybeArray<AfterRouteHook>,
  onAfterRouteLeave?: MaybeArray<AfterRouteHook>,
}

export type ParentRouteProps = WithHooks & {
  name?: string,
  path: string | Path,
  query?: string | Query,
  disabled?: boolean,
  children: Routes,
  component?: RouteComponent,
  meta?: RouteMeta,
}

export type ChildRouteProps = WithHooks & {
  name: string,
  disabled?: boolean,
  path: string | Path,
  query?: string | Query,
  component: RouteComponent,
  meta?: RouteMeta,
}

export type RouteProps = Readonly<ParentRouteProps | ChildRouteProps>

export function isParentRoute(value: RouteProps): value is ParentRouteProps {
  return 'children' in value
}