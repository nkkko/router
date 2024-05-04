import { Path } from '@/types/path'
import { Query } from '@/types/query'
import { Route, Routes } from '@/types/route'
import { Router } from '@/types/router'
import { RouterPush } from '@/types/routerPush'
import { RouterReplace } from '@/types/routerReplace'
import { RoutesKey, RoutesMap } from '@/types/routesMap'

export interface Register {
  // router: Router
  // rejections: ['Auth'],
  // state: {}
}

export type RegisteredRouter = Register extends { router: infer TRouter }
  ? TRouter
  : Router

export type RegisteredRoutes = Register extends { router: Router<infer TRoutes extends Routes> }
  ? TRoutes
  : Route<string, Path<'', {}>, Query<'', {}>, false>[]

export type RegisteredRejectionType = Register extends { rejections: infer TRejections extends string[] }
  ? TRejections[number]
  : never

export type RegisteredRouterState = Register extends { state: infer TState }
  ? TState
  : {}

// Because RegisteredRoutes defaults to `[]` it thinks passing it is unnecessary
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
export type RegisteredRouteMap = RoutesMap<RegisteredRoutes>

export type RegisteredRoutesKey = RoutesKey<RegisteredRoutes>

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
export type RegisteredRouterPush = RouterPush<RegisteredRoutes>

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
export type RegisteredRouterReplace = RouterReplace<RegisteredRoutes>